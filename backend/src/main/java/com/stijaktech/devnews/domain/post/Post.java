package com.stijaktech.devnews.domain.post;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.stijaktech.devnews.domain.Blameable;
import com.stijaktech.devnews.domain.community.Community;
import com.stijaktech.devnews.domain.user.User;
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
@NoArgsConstructor
@Document("posts")
@EqualsAndHashCode(of = "id")
public class Post implements Blameable {

    @Id
    private String id;

    @JsonIgnore
    private String communityId;

    @NotBlank
//    @SafeHtml(whitelistType = NONE)
    private String title;

    @Indexed(unique = true)
    @JsonProperty(access = READ_ONLY)
    private String alias;

    @NotBlank
//    @SafeHtml
    private String content;

    @JsonProperty(access = READ_ONLY)
    private int commentsCount;

    @CreatedBy
    @ToString.Exclude
    @DBRef(lazy = true)
    private User createdBy;

    @LastModifiedBy
    @ToString.Exclude
    @DBRef(lazy = true)
    private User updatedBy;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;

    @DBRef
    @ToString.Exclude
    private Community community;

}
