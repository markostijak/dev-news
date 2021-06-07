package com.stijaktech.devnews.domain.community;

import com.stijaktech.devnews.domain.Status;
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

import java.time.Instant;
import java.util.List;

@Data
@Document("communities")
@ToString(of = {"id", "title"})
@EqualsAndHashCode(of = {"id", "title"})
public class Community {

    @Id
    private String id;

    private String logo;

    private String title;

    @Indexed(unique = true)
    private String alias;

    private Status status;

    @DBRef(lazy = true)
    private List<Post> posts;

    @CreatedBy
    @DBRef(lazy = true)
    private User createdBy;

    @LastModifiedBy
    @DBRef(lazy = true)
    private User updatedBy;

    private String description;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;

}
