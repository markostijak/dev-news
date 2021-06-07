package com.stijaktech.devnews.domain.user;

public enum Provider {
    LOCAL("local"),
    FACEBOOK("facebook"),
    GOOGLE("google"),
    GITHUB("github");

    private final String name;

    Provider(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return name;
    }

    public String getName() {
        return name;
    }
}
