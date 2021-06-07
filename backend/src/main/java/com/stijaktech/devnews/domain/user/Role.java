package com.stijaktech.devnews.domain.user;

public enum Role {
    USER("ROLE_USER"),
    ADMIN("ROLE_ADMIN"),
    WEBMASTER("ROLE_WEBMASTER"),
    MODERATOR("ROLE_MODERATOR");

    private final String role;

    Role(String role) {
        this.role = role;
    }

    public String asString() {
        return role;
    }

}
