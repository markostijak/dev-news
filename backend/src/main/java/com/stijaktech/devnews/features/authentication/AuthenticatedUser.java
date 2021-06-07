package com.stijaktech.devnews.features.authentication;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.stijaktech.devnews.domain.user.Privilege;
import com.stijaktech.devnews.domain.user.Role;
import com.stijaktech.devnews.domain.user.User;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Set;
import java.util.stream.Stream;

import static java.util.stream.Collectors.toSet;

@Getter
public class AuthenticatedUser implements UserDetails {

    private final String id;

    private final Role role;

    private final String username;

    private final Set<Privilege> privileges;

    private final String device;

    public AuthenticatedUser(User user, String device) {
        this(user.getId(), user.getUsername(), user.getRole(), user.getPrivileges(), device);
    }

    @JsonCreator
    public AuthenticatedUser(
            @JsonProperty("id") String id,
            @JsonProperty("username") String username,
            @JsonProperty("role") Role role,
            @JsonProperty("privileges") Set<Privilege> privileges,
            @JsonProperty("device") String device) {
        this.id = id;
        this.role = role;
        this.username = username;
        this.privileges = privileges;
        this.device = device;
    }

    @JsonIgnore
    public String getPassword() {
        throw new UnsupportedOperationException();
    }

    @JsonIgnore
    public boolean isEnabled() {
        return true;
    }

    @JsonIgnore
    public boolean isAccountNonExpired() {
        return true;
    }

    @JsonIgnore
    public boolean isAccountNonLocked() {
        return true;
    }

    @JsonIgnore
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @JsonIgnore
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Stream.concat(Stream.of(role.asString()), privileges.stream().map(Privilege::asString))
                .map(SimpleGrantedAuthority::new).collect(toSet());
    }

    public User toUser() {
        User user = new User();
        user.setId(id);
        user.setRole(role);
        user.setUsername(username);
        user.setPrivileges(privileges);
        return user;
    }

}
