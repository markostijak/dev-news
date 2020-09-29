package com.stijaktech.devnews.features.authentication.jwt;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class JwtAwareAuthenticationFailureHandler implements AuthenticationFailureHandler {

    private final Counter counter;

    public JwtAwareAuthenticationFailureHandler(MeterRegistry meterRegistry) {
        this.counter = Counter.builder("authentication.failure").register(meterRegistry);
    }

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException {
        response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
        counter.increment();
    }

}
