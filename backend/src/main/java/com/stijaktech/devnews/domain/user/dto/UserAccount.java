package com.stijaktech.devnews.domain.user.dto;

import com.stijaktech.devnews.domain.Status;
import com.stijaktech.devnews.domain.user.Privilege;
import com.stijaktech.devnews.domain.user.Role;
import com.stijaktech.devnews.domain.user.User;
import org.springframework.data.rest.core.config.Projection;

import java.time.Instant;
import java.util.Set;

@Projection(name = "account", types = User.class)
public interface UserAccount {

    Role getRole();

    String getEmail();

    Status getStatus();

    String getPicture();

    String getUsername();

    String getLastName();

    String getFirstName();

    Instant getCreatedAt();

    Set<Privilege> getPrivileges();

}
