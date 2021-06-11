package com.stijaktech.devnews.domain.community;

import com.stijaktech.devnews.domain.post.Post;
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
@Document("communities")
@ToString(of = {"id", "title"})
@EqualsAndHashCode(of = {"id", "title"})
public class Community {

    @Id
    private String id;

    @NonNull
    @NotBlank
    private String logo;

    @NonNull
    @NotBlank
    private String title;

    @Indexed(unique = true)
    private String alias;

    @CreatedBy
    @DBRef(lazy = true)
    private User createdBy;

    @LastModifiedBy
    @DBRef(lazy = true)
    private User updatedBy;

    @NonNull
    @NotBlank
    private String description;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;

    @DBRef(lazy = true)
    private List<Post> posts = emptyList();

}
