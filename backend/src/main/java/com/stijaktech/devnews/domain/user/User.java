package com.stijaktech.devnews.domain.user;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;
import com.stijaktech.devnews.domain.Status;
import com.stijaktech.devnews.domain.community.Community;
import com.stijaktech.devnews.features.authentication.Provider;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import java.time.Instant;
import java.util.Collection;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static com.fasterxml.jackson.annotation.JsonInclude.Include.NON_NULL;
import static java.util.stream.Collectors.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document("users")
@JsonInclude(NON_NULL)
public class User implements UserDetails {

    @Id
    private String id;

    private String role;

    @Email
    @Indexed(unique = true)
    private String email;

    private Status status;

    private String picture;

    @Indexed(unique = true)
    @Size(min = 8, max = 64)
    private String username;

    @NotBlank
    @Size(min = 1, max = 64)
    private String lastName;

    @NotBlank
    @Size(min = 1, max = 64)
    private String firstName;

    @JsonIgnore
    @CreatedDate
    private Instant createdAt;

    @JsonIgnore
    @LastModifiedDate
    private Instant updatedAt;

    @JsonIgnore
    @DBRef(lazy = true)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Set<Community> communities = Set.of();

    @JsonProperty(access = Access.WRITE_ONLY)
    @Pattern(regexp = "^(?=.*\\d)(?=.*[A-Z]).{8,32}$")
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
        return Stream.concat(Stream.of(role), privileges.stream())
                .map(SimpleGrantedAuthority::new).collect(toSet());
    }

}
