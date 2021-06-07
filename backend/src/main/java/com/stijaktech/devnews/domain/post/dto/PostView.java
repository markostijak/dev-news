package com.stijaktech.devnews.domain.post.dto;

import com.stijaktech.devnews.domain.post.Post;
import com.stijaktech.devnews.domain.user.User;
import org.springframework.data.rest.core.config.Projection;

import java.time.Instant;

@Projection(name = "view", types = Post.class)
public interface PostView {

    String getTitle();

    String getAlias();

    String getContent();

    User getCreatedBy();

    User getUpdatedBy();

    Instant getCreatedAt();

    Instant getUpdatedAt();

}
