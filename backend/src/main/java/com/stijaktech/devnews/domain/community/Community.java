package com.stijaktech.devnews.domain.community;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.stijaktech.devnews.domain.Blameable;
import com.stijaktech.devnews.domain.Status;
import com.stijaktech.devnews.domain.user.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.validation.constraints.NotBlank;
import java.time.Instant;

import static com.fasterxml.jackson.annotation.JsonProperty.Access.READ_ONLY;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Document("communities")
@EqualsAndHashCode(of = "id")
public class Community implements Blameable {

    @Id
    private String id;

    private String logo;

    @NotBlank
//    @SafeHtml(whitelistType = NONE)
    private String title;

    @Indexed(unique = true)
    @JsonProperty(access = READ_ONLY)
    private String alias;

    @JsonProperty(access = READ_ONLY)
    private int postsCount;

    @JsonProperty(access = READ_ONLY)
    private int membersCount;

    private Status status;

    @DBRef
    @CreatedBy
    @ToString.Exclude
    private User createdBy;

    @JsonIgnore
    @LastModifiedBy
    @ToString.Exclude
    @DBRef(lazy = true)
    private User updatedBy;

    @NotBlank
//    @SafeHtml(whitelistType = NONE)
    private String description;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;

}
