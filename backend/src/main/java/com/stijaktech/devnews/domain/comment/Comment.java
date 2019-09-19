package com.stijaktech.devnews.domain.comment;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.stijaktech.devnews.domain.post.Post;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.validation.constraints.NotNull;

import static com.fasterxml.jackson.annotation.JsonInclude.Include.NON_NULL;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document("comments")
@JsonInclude(NON_NULL)
@EqualsAndHashCode(callSuper = true)
public class Comment extends Reply {

    @DBRef
    @NotNull
    @EqualsAndHashCode.Exclude
    private Post post;

}
