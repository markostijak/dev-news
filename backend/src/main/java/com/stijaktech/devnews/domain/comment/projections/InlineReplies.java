package com.stijaktech.devnews.domain.comment.projections;

import com.stijaktech.devnews.domain.comment.Comment;
import com.stijaktech.devnews.domain.user.projections.UserPreview;
import org.springframework.data.rest.core.config.Projection;

import java.time.Instant;

@Projection(name = "inline-replies", types = Comment.class)
public interface InlineReplies {

    String getId();

    String getContent();

    Instant getCreatedAt();

    Instant getUpdatedAt();

    UserPreview getCreatedBy();

    InlineReplies getReplies();

}
