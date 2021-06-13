package com.stijaktech.devnews.domain.comment;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.stijaktech.devnews.domain.post.Post;
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
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.lang.NonNull;

import javax.validation.constraints.NotBlank;
import java.time.Instant;
import java.util.List;

@Data
@NoArgsConstructor
@Document("comments")
@ToString(of = {"id", "fullSlug"})
@EqualsAndHashCode(of = {"id", "fullSlug"})
public class Comment {

    @Id
    private String id;

    private String slug;

    private String fullSlug;

    @DBRef(lazy = true)
    private Post post;

    @NonNull
    @NotBlank
    private String content;

    @CreatedBy
    @DBRef(lazy = true)
    private User createdBy;

    @LastModifiedBy
    @DBRef(lazy = true)
    private User updatedBy;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;

    @DBRef(lazy = true)
    private Comment parent;

    @JsonIgnore
    @DBRef(lazy = true)
    private List<Comment> replies;

}
