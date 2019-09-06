package com.stijaktech.devnews.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

public abstract class ModelException extends RuntimeException {

    public ModelException() {
    }

    ModelException(String message) {
        super(message);
    }

    public ModelException(String message, Throwable cause) {
        super(message, cause);
    }

    @ResponseStatus(code = HttpStatus.NOT_FOUND, reason = "Model not found.")
    public static class ModelNotFoundException extends ModelException {
        public ModelNotFoundException() {
        }

        public ModelNotFoundException(String message) {
            super(message);
        }

        public ModelNotFoundException(String message, Throwable cause) {
            super(message, cause);
        }
    }

    @ResponseStatus(code = HttpStatus.CONFLICT, reason = "Model already present.")
    public static class ModelAlreadyPresentException extends ModelException {
        public ModelAlreadyPresentException() {
        }

        public ModelAlreadyPresentException(String message) {
            super(message);
        }

        public ModelAlreadyPresentException(String message, Throwable cause) {
            super(message, cause);
        }
    }

    @ResponseStatus(code = HttpStatus.BAD_REQUEST, reason = "Model validation failed.")
    public static class ModelValidationFailedException extends ModelException {
        public ModelValidationFailedException() {
        }

        public ModelValidationFailedException(String message) {
            super(message);
        }

        public ModelValidationFailedException(String message, Throwable cause) {
            super(message, cause);
        }
    }

}
