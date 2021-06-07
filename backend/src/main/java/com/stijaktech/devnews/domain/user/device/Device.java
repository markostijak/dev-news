package com.stijaktech.devnews.domain.user.device;

import lombok.Data;

import java.time.Instant;

@Data
public class Device {

    private String ip;

    private String os;

    private String osVersion;

    private String agent;

    private String token;

    private Instant createdAt;

    private Instant lastUsedOn;

    public boolean isNew() {
        return createdAt.equals(lastUsedOn);
    }

    public String getName() {
        return agent + " on " + os;
    }

}
