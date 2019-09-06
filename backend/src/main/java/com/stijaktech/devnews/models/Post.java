package com.stijaktech.devnews.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Post {

    @Id
    private String id;

    private String title;

    private String content;

    @DBRef
    @CreatedBy
    // @JsonIgnore
    private User createdBy;

    @DBRef
    // @JsonIgnore
    @LastModifiedBy
    private User updatedBy;

    @CreatedDate
    private Instant createdAt;

    // @JsonIgnore
    @LastModifiedDate
    private Instant updatedAt;

    private List<Comment> comments;

}
