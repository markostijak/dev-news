package com.stijaktech.devnews.domain.post.projections;

import com.stijaktech.devnews.domain.community.projections.CommunityPreview;
import com.stijaktech.devnews.domain.post.Post;
import com.stijaktech.devnews.domain.user.User;
import com.stijaktech.devnews.domain.user.projections.UserPreview;
import org.springframework.data.rest.core.config.Projection;

import java.time.Instant;

@Projection(name = "inline-community", types = Post.class)
public interface InlineCommunity {

    String getId();

    String getTitle();

    String getContent();

    Instant getCreatedAt();

    Instant getUpdatedAt();

    UserPreview getCreatedBy();

    CommunityPreview getCommunity();

}
