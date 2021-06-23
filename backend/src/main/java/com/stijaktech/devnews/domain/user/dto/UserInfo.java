package com.stijaktech.devnews.domain.user.dto;

import com.stijaktech.devnews.domain.Status;
import com.stijaktech.devnews.domain.user.Role;
import com.stijaktech.devnews.domain.user.User;
import org.springframework.data.rest.core.config.Projection;

import java.time.Instant;

@Projection(name = "info", types = User.class)
public interface UserInfo {

    Role getRole();

    Status getStatus();

    String getPicture();

    String getUsername();

    String getLastName();

    String getFirstName();

    Instant getCreatedAt();

}
