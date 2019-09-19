package com.stijaktech.devnews.features.upload;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.BAD_REQUEST, reason = "File is not present in request.")
public class FileNotPresentException extends RuntimeException {

    public FileNotPresentException() {
    }

    public FileNotPresentException(String message) {
        super(message);
    }

    public FileNotPresentException(String message, Throwable cause) {
        super(message, cause);
    }

    public FileNotPresentException(Throwable cause) {
        super(cause);
    }

    public FileNotPresentException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }

}
