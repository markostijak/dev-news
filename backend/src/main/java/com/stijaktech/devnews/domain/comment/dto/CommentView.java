package com.stijaktech.devnews.domain.comment.dto;

import com.stijaktech.devnews.domain.comment.Comment;
import com.stijaktech.devnews.domain.user.User;
import org.springframework.data.rest.core.config.Projection;

import java.time.Instant;

@Projection(name = "view", types = Comment.class)
public interface CommentView {

    String getContent();

    String getSlug();

    String getFullSlug();

    Instant getCreatedAt();

    Instant getUpdatedAt();

    User getCreatedBy();

    User getUpdatedBy();

}
