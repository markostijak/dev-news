package com.stijaktech.devnews.domain.user;

import com.stijaktech.devnews.domain.Status;
import com.stijaktech.devnews.domain.community.Community;
import com.stijaktech.devnews.domain.user.device.Device;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.Set;

import static java.util.Collections.emptySet;

@Data
@Document("users")
@ToString(of = {"id", "email"})
@EqualsAndHashCode(of = {"id", "email"})
public class User {

    @Id
    private String id;

    private Role role;

    @Indexed(unique = true)
    private String email;

    private Status status;

    private String picture;

    @Indexed(unique = true)
    private String username;

    private String lastName;

    private String firstName;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;

    private String password;

    private String resetToken;

    private Provider provider;

    private String activationCode;

    private Set<Privilege> privileges;

    private Set<Device> devices;

    @DBRef(lazy = true)
    private Set<Community> communities = emptySet();

}
