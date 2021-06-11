package com.stijaktech.devnews.domain.post.dto;

import com.stijaktech.devnews.domain.post.Post;
import com.stijaktech.devnews.domain.user.dto.UserView;
import org.springframework.data.rest.core.config.Projection;

import java.time.Instant;

@Projection(name = "preview", types = Post.class)
public interface PostPreview {

    String getTitle();

    String getAlias();

    UserView getCreatedBy();

    Instant getCreatedAt();

}
