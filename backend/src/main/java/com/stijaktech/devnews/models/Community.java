package com.stijaktech.devnews.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.lang.NonNull;

import java.time.Instant;
import java.util.List;

import static com.fasterxml.jackson.annotation.JsonInclude.Include.NON_NULL;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(NON_NULL)
public class Community {

    @Id
    private String id;

    @NonNull
    private String logo;

    @NonNull
    private String title;

    @Indexed
    private String alias;

    private long members;

    // @JsonIgnore
    private Status status;

    private long postsCount;

    @DBRef
    private List<Post> posts;

    @DBRef
    @CreatedBy
    // @JsonIgnore
    private User createdBy;

    @DBRef
    // @JsonIgnore
    @LastModifiedBy
    private User updatedBy;

    @NonNull
    private String description;

    // @JsonIgnore
    @CreatedDate
    private Instant createdAt;

    // @JsonIgnore
    @LastModifiedDate
    private Instant updatedAt;

}
