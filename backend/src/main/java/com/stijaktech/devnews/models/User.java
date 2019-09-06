package com.stijaktech.devnews.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
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

    @Indexed
    private String email;

    private Status status;

    private String picture;

    @Indexed
    private String username;

    private String lastName;

    private String firstName;

    // @JsonIgnore
    private LocalDateTime createdAt;

    // @JsonIgnore
    private LocalDateTime updatedAt;

    @DBRef
    private Set<Community> myCommunities;

    @JsonProperty(access = Access.WRITE_ONLY)
    private String password;

    @JsonProperty(access = Access.WRITE_ONLY)
    private String resetToken;

    @JsonProperty(access = Access.WRITE_ONLY)
    private Provider provider;

    @JsonProperty(access = Access.WRITE_ONLY)
    private String refreshToken;

    @JsonProperty(access = Access.WRITE_ONLY)
    private String activationCode;

    @JsonProperty(access = Access.WRITE_ONLY)
    private Set<String> privileges;

    @Override
    @JsonIgnore
    public boolean isEnabled() {
        return status == Status.ACTIVE;
    }

    @Override
    @JsonIgnore
    public boolean isAccountNonLocked() {
        return status != Status.LOCKED;
    }

    @Override
    @JsonIgnore
    public boolean isAccountNonExpired() {
        return status != Status.EXPIRED;
    }

    @Override
    @JsonIgnore
    public boolean isCredentialsNonExpired() {
        return status != Status.CREDENTIALS_EXPIRED;
    }

    @Override
    @JsonIgnore
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return privileges.stream().map(SimpleGrantedAuthority::new).collect(Collectors.toList());
    }

}
