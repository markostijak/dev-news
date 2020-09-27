package com.stijaktech.devnews.domain.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Device {
    private long id;
    private String ip;
    private String name;
    private String token;
    private Instant createdAt;
}
