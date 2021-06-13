package com.stijaktech.devnews.configuration;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.stijaktech.devnews.domain.ModelException;
import lombok.Builder;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.validator.internal.engine.path.PathImpl;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingPathVariableException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import javax.servlet.FilterChain;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.ConstraintViolationException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static com.fasterxml.jackson.annotation.JsonInclude.Include.NON_NULL;

@Slf4j
@ControllerAdvice
@SuppressWarnings("NullableProblems")
public class ApplicationExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(ModelException.ModelNotFoundException.class)
    public ResponseEntity<Object> handleModelNotFound(ModelException.ModelNotFoundException e, WebRequest request) {
        return handleExceptionInternal(e, e.getMessage(), HttpHeaders.EMPTY, HttpStatus.NOT_FOUND, request);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<Object> handleConstraintViolation(ConstraintViolationException e, WebRequest request) {
        List<String> errors = new ArrayList<>();
        e.getConstraintViolations().forEach(error -> {
            String fieldName = (((PathImpl) error.getPropertyPath()).getLeafNode().getName());
            String errorMessage = error.getMessage();
            errors.add(fieldName + " " + errorMessage);
        });

        return handleExceptionInternal(e, errors, HttpHeaders.EMPTY, HttpStatus.BAD_REQUEST, request);
    }

    @Override
    protected ResponseEntity<Object> handleMissingPathVariable(MissingPathVariableException e, HttpHeaders headers, HttpStatus status, WebRequest request) {
        String message = e.getParameter().getParameterType().getSimpleName() + " not found";
        return handleExceptionInternal(e, message, headers, HttpStatus.NOT_FOUND, request);
    }

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException e, HttpHeaders headers, HttpStatus status, WebRequest request) {
        List<String> errors = new ArrayList<>();
        e.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.add(fieldName + " " + errorMessage);
        });

        return handleExceptionInternal(e, errors, headers, HttpStatus.BAD_REQUEST, request);
    }

    @ExceptionHandler(Exception.class)
    public final ResponseEntity<Object> handleAllExceptions(Exception e, WebRequest request) {
        HttpStatus status = HttpStatus.BAD_REQUEST;

        if (e instanceof AccessDeniedException) {
            status = HttpStatus.FORBIDDEN;
        }

        return handleExceptionInternal(e, e.getMessage(), HttpHeaders.EMPTY, status, request);
    }

    @Override
    protected ResponseEntity<Object> handleExceptionInternal(Exception e, Object body, HttpHeaders headers, HttpStatus status, WebRequest request) {
        Error error = Error.builder()
                .status(status.getReasonPhrase())
                .type(e.getClass().getSimpleName())
                .code(status.value())
                .message(body)
                .build();

        if (log.isDebugEnabled()) {
            log.debug(e.getMessage(), e.getCause());
        }

        return super.handleExceptionInternal(e, Map.of("error", error), headers, status, request);
    }

    @Data
    @Builder
    @JsonInclude(NON_NULL)
    static class Error {
        private final String status;
        private final Object message;
        private final String type;
        private final int code;
    }

    public static class ExceptionHandlingFilter extends OncePerRequestFilter {

        private final HandlerExceptionResolver handlerExceptionResolver;

        public ExceptionHandlingFilter(HandlerExceptionResolver handlerExceptionResolver) {
            this.handlerExceptionResolver = handlerExceptionResolver;
        }

        @Override
        protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain) {
            try {
                chain.doFilter(request, response);
            } catch (Exception e) {
                handlerExceptionResolver.resolveException(request, response, null, e);
            }
        }
    }

}
