package com.stijaktech.devnews.features.authentication;

import javax.servlet.http.HttpServletRequest;

public record WebDetails(String ipAddress, String userAgent) {

    public WebDetails(HttpServletRequest request) {
        this(request.getRemoteAddr(), request.getHeader("User-Agent"));
    }

}
