package com.stijaktech.devnews.domain.post.projections;

import com.stijaktech.devnews.domain.community.projections.CommunityPreviewProjection;
import com.stijaktech.devnews.domain.post.Post;
import org.springframework.data.rest.core.config.Projection;

import java.time.Instant;

@Projection(name = "trending", types = Post.class)
public interface TrendingProjection {

    String getTitle();

    String getAlias();

    long getCommentsCount();

    Instant getCreatedAt();

    CommunityPreviewProjection getCommunity();
}
