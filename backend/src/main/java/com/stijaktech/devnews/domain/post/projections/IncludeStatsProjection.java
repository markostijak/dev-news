package com.stijaktech.devnews.domain.post.projections;

import com.stijaktech.devnews.domain.community.projections.CommunityPreviewProjection;
import com.stijaktech.devnews.domain.post.Post;
import com.stijaktech.devnews.domain.user.projections.UserPreviewProjection;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

import java.time.Instant;

@Projection(name = "include-stats", types = Post.class)
public interface IncludeStatsProjection {

    String getId();

    String getTitle();

    String getAlias();

    String getContent();

    Instant getCreatedAt();

    Instant getUpdatedAt();

    long getCommentsCount();

    UserPreviewProjection getCreatedBy();

    CommunityPreviewProjection getCommunity();

}
