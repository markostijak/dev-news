package com.stijaktech.devnews.domain.user.dto;

import com.stijaktech.devnews.domain.Status;
import com.stijaktech.devnews.domain.community.Community;
import com.stijaktech.devnews.domain.user.Privilege;
import com.stijaktech.devnews.domain.user.Provider;
import com.stijaktech.devnews.domain.user.Role;
import com.stijaktech.devnews.domain.user.User;
import com.stijaktech.devnews.domain.user.device.Device;
import org.springframework.data.rest.core.config.Projection;

import java.time.Instant;
import java.util.Set;

@Projection(name = "profile", types = User.class)
public interface UserProfile {

    Role getRole();

    String getEmail();

    Status getStatus();

    String getPicture();

    String getUsername();

    String getLastName();

    String getFirstName();

    Instant getCreatedAt();

    Instant getUpdatedAt();

    Provider getProvider();

    Set<Device> getDevices();

    Set<Privilege> getPrivileges();

    Set<Community> getCommunities();

}
