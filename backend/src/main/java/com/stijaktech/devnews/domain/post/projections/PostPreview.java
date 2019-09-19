package com.stijaktech.devnews.domain.post.projections;

import com.stijaktech.devnews.domain.post.Post;
import com.stijaktech.devnews.domain.user.projections.UserPreview;
import org.springframework.data.rest.core.config.Projection;

import java.time.Instant;

@Projection(name = "preview", types = Post.class)
public interface PostPreview {

    String getId();

    String getTitle();

    String getContent();

    Instant getCreatedAt();

    Instant getUpdatedAt();

    UserPreview getCreatedBy();

}
