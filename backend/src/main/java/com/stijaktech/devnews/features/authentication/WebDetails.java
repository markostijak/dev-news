package com.stijaktech.devnews.features.authentication;

import lombok.Getter;

import javax.servlet.http.HttpServletRequest;

@Getter
public class WebDetails {

    private final String ipAddress;
    private final String userAgent;

    public WebDetails(HttpServletRequest request) {
        this.ipAddress = request.getRemoteAddr();
        this.userAgent = request.getHeader("User-Agent");
    }

}
