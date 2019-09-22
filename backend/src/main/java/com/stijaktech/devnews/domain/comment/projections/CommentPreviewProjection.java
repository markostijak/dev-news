package com.stijaktech.devnews.domain.comment.projections;

import com.stijaktech.devnews.domain.comment.Comment;
import com.stijaktech.devnews.domain.user.projections.UserPreviewProjection;
import org.springframework.data.rest.core.config.Projection;

import java.time.Instant;

@Projection(name = "preview", types = Comment.class)
public interface CommentPreviewProjection {

    String getId();

    String getSlug();

    String getContent();

    String getFullSlug();

    String getParentId();

    Instant getCreatedAt();

    Instant getUpdatedAt();

    UserPreviewProjection getCreatedBy();

}
