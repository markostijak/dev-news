package com.stijaktech.devnews.domain.post;

import com.stijaktech.devnews.domain.comment.Comment;
import com.stijaktech.devnews.domain.community.Community;
import com.stijaktech.devnews.domain.user.User;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.lang.NonNull;

import javax.validation.constraints.NotBlank;
import java.time.Instant;
import java.util.List;

import static java.util.Collections.emptyList;

@Data
@Document("posts")
@ToString(of = {"id", "title"})
@EqualsAndHashCode(of = {"id", "title"})
public class Post {

    @Id
    private String id;

    @NonNull
    @NotBlank
    private String title;

    @Indexed(unique = true)
    private String alias;

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
    private Community community;

    @DBRef(lazy = true)
    private List<Comment> comments = emptyList();

}
