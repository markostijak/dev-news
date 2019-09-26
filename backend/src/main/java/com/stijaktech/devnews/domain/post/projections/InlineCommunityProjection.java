package com.stijaktech.devnews.domain.post.projections;

import com.stijaktech.devnews.domain.community.projections.CommunityPreviewProjection;
import com.stijaktech.devnews.domain.post.Post;
import com.stijaktech.devnews.domain.user.projections.UserPreviewProjection;
import org.springframework.data.rest.core.config.Projection;

import java.time.Instant;

@Projection(name = "inline-community", types = Post.class)
public interface InlineCommunityProjection {

    String getId();

    String getTitle();

    String getAlias();

    String getContent();

    Instant getCreatedAt();

    Instant getUpdatedAt();

    UserPreviewProjection getCreatedBy();

    CommunityPreviewProjection getCommunity();

}
