package com.stijaktech.devnews.domain.post.projections;

import com.stijaktech.devnews.domain.comment.projections.InlineReplies;
import com.stijaktech.devnews.domain.post.Post;
import com.stijaktech.devnews.domain.user.projections.UserPreview;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

import java.time.Instant;
import java.util.List;

@Projection(name = "inline-comments", types = Post.class)
public interface InlineComments {

    String getId();

    String getTitle();

    String getContent();

    Instant getCreatedAt();

    Instant getUpdatedAt();

    UserPreview getCreatedBy();

    @Value("#{@commentRepository.findAllByPostOrderByCreatedAtAsc(target)")
    List<InlineReplies> getComments();

}
