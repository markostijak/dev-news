package com.stijaktech.devnews.domain.post;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.stijaktech.devnews.domain.community.Community;
import com.stijaktech.devnews.domain.user.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.hibernate.validator.constraints.SafeHtml;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.validation.constraints.NotBlank;
import java.time.Instant;

import static com.fasterxml.jackson.annotation.JsonInclude.Include.NON_NULL;
import static org.hibernate.validator.constraints.SafeHtml.WhiteListType.NONE;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document("posts")
@JsonInclude(NON_NULL)
public class Post {

    @Id
    private String id;

    @NotBlank
    @SafeHtml(whitelistType = NONE)
    private String title;

    @NotBlank
    @SafeHtml
    private String content;

    @CreatedBy
    @DBRef(lazy = true)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private User createdBy;

    @LastModifiedBy
    @DBRef(lazy = true)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private User updatedBy;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;

    @DBRef
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Community community;

}
