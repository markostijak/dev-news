package com.stijaktech.devnews.domain.comment;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.stijaktech.devnews.domain.Blamable;
import com.stijaktech.devnews.domain.post.Post;
import com.stijaktech.devnews.domain.user.User;
import lombok.AllArgsConstructor;
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

import static com.fasterxml.jackson.annotation.JsonInclude.Include.NON_NULL;
import static com.fasterxml.jackson.annotation.JsonProperty.Access.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document("comments")
@JsonInclude(NON_NULL)
public class Comment implements Blamable {

    @Id
    private String id;

    private String parentId;

    private String slug;

    private String fullSlug;

    @Nullable
    @DBRef(lazy = true)
    @EqualsAndHashCode.Exclude
    @JsonProperty(access = WRITE_ONLY)
    private Comment parent;

    @NotNull
    @DBRef(lazy = true)
    @EqualsAndHashCode.Exclude
    @JsonProperty(access = WRITE_ONLY)
    private Post post;

    @NotBlank
    @SafeHtml
    private String content;

    @DBRef
    @CreatedBy
    @EqualsAndHashCode.Exclude
    private User createdBy;

    @JsonIgnore
    @LastModifiedBy
    @DBRef(lazy = true)
    @EqualsAndHashCode.Exclude
    private User updatedBy;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;

}
