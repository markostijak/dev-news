package com.stijaktech.devnews.domain.comment;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
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

import javax.validation.constraints.NotBlank;
import java.time.Instant;
import java.util.List;

import static com.fasterxml.jackson.annotation.JsonInclude.Include.NON_NULL;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(NON_NULL)
public class Reply {

    @Id
    protected String id;

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

    @JsonIgnore
    @LastModifiedDate
    private Instant updatedAt;

    @EqualsAndHashCode.Exclude
    private List<Reply> replies = List.of();

}
