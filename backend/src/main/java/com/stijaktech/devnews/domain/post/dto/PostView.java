package com.stijaktech.devnews.domain.post.dto;

import com.stijaktech.devnews.domain.community.dto.CommunityPreview;
import com.stijaktech.devnews.domain.post.Post;
import com.stijaktech.devnews.domain.user.dto.UserView;
import org.springframework.data.rest.core.config.Projection;

import java.time.Instant;

@Projection(name = "view", types = Post.class)
public interface PostView {

    String getTitle();

    String getAlias();

    String getContent();

    UserView getCreatedBy();

    UserView getUpdatedBy();

    Instant getCreatedAt();

    Instant getUpdatedAt();

    CommunityPreview getCommunity();

}
