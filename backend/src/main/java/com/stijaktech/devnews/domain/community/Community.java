package com.stijaktech.devnews.domain.community;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.stijaktech.devnews.domain.Status;
import com.stijaktech.devnews.domain.post.Post;
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
import java.util.List;

import static com.fasterxml.jackson.annotation.JsonInclude.Include.NON_NULL;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document("communities")
@JsonInclude(NON_NULL)
public class Community {

    @Id
    private String id;

    private String logo;

    @NotBlank
    private String title;

    @Indexed(unique = true)
    private String alias;

    private Status status;

    @DBRef
    @CreatedBy
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private User createdBy;

    @DBRef
    @LastModifiedBy
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private User updatedBy;

    @NotBlank
    private String description;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;

}
