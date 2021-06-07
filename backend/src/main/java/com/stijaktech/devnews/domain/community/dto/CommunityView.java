package com.stijaktech.devnews.domain.community.dto;

import com.stijaktech.devnews.domain.community.Community;
import com.stijaktech.devnews.domain.user.User;
import org.springframework.data.rest.core.config.Projection;

import java.time.Instant;

@Projection(name = "view", types = Community.class)
public interface CommunityView {

    String getId();

    String getLogo();

    String getTitle();

    String getAlias();

    User getCreatedBy();

    String getDescription();

    Instant getCreatedAt();

}
