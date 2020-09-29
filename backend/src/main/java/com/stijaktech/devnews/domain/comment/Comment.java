package com.stijaktech.devnews.domain.comment;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.stijaktech.devnews.domain.Blameable;
import com.stijaktech.devnews.domain.post.Post;
import com.stijaktech.devnews.domain.user.User;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.SafeHtml;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.lang.Nullable;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.time.Instant;

import static com.fasterxml.jackson.annotation.JsonProperty.Access.*;

@Data
@NoArgsConstructor
@Document("comments")
@EqualsAndHashCode(of = "id")
public class Comment implements Blameable {

    @Id
    private String id;

    @JsonIgnore
    private String postId;

    private String parentId;

    private String slug;

    private String fullSlug;

    @Nullable
    @DBRef(lazy = true)
    @JsonProperty(access = WRITE_ONLY)
    private Comment parent;

    @NotNull
    @DBRef(lazy = true)
    @JsonProperty(access = WRITE_ONLY)
    private Post post;

    @NotBlank
    @SafeHtml
    private String content;

    @DBRef
    @CreatedBy
    private User createdBy;

    @JsonIgnore
    @LastModifiedBy
    @DBRef(lazy = true)
    private User updatedBy;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;

}
