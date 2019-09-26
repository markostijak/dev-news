package com.stijaktech.devnews.domain.post.projections;

import com.stijaktech.devnews.domain.comment.projections.InlineRepliesProjection;
import com.stijaktech.devnews.domain.post.Post;
import com.stijaktech.devnews.domain.user.projections.UserPreviewProjection;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

import java.time.Instant;
import java.util.List;

@Projection(name = "inline-comments", types = Post.class)
public interface InlineCommentsProjection {

    String getId();

    String getTitle();

    String getAlias();

    String getContent();

    Instant getCreatedAt();

    Instant getUpdatedAt();

    UserPreviewProjection getCreatedBy();

    @Value("#{@commentRepository.findAllByPostOrderByCreatedAtAsc(target)")
    List<InlineRepliesProjection> getComments();

}
