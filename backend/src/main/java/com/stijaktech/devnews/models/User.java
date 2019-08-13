package com.stijaktech.devnews.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Set;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document("users")
public class User implements UserDetails {

    @Id
    private String id;
    private String role;
    private Status status;
    @Indexed
    private String email;
    private String picture;
    private String password;
    @Indexed
    private String username;
    private String lastName;
    private String firstName;
    private String resetToken;
    private Provider provider;
    private String refreshToken;
    private String activationCode;
    private Set<String> privileges;

    @Override
    public boolean isEnabled() {
        return status == Status.ACTIVE;
    }

    @Override
    public boolean isAccountNonLocked() {
        return status != Status.LOCKED;
    }

    @Override
    public boolean isAccountNonExpired() {
        return status != Status.EXPIRED;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return status != Status.CREDENTIALS_EXPIRED;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return privileges.stream().map(SimpleGrantedAuthority::new).collect(Collectors.toList());
    }

}
