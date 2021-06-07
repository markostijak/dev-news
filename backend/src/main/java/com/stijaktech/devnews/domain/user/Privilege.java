package com.stijaktech.devnews.domain.user;

public enum Privilege {
    READ("READ_PRIVILEGE"),
    WRITE("WRITE_PRIVILEGE"),
    DELETE("DELETE_PRIVILEGE");

    private final String privilege;

    Privilege(String privilege) {
        this.privilege = privilege;
    }

    public String asString() {
        return privilege;
    }

}
