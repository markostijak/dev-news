package com.stijaktech.devnews.domain.post.projections;

import com.stijaktech.devnews.domain.post.Post;
import com.stijaktech.devnews.domain.user.projections.UserPreview;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

import java.time.Instant;

@Projection(name = "include-stats", types = Post.class)
public interface IncludeStats {

    String getId();

    String getTitle();

    String getContent();

    Instant getCreatedAt();

    Instant getUpdatedAt();

    UserPreview getCreatedBy();
/*
    @Value("#{@commentRepository.countByPost(target)}")
    long getCommentsCount();
*/
}
