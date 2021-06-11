package com.stijaktech.devnews.domain.community.dto;

import com.stijaktech.devnews.domain.community.Community;
import com.stijaktech.devnews.domain.user.dto.UserView;
import org.springframework.data.rest.core.config.Projection;

import java.time.Instant;

@Projection(name = "view", types = Community.class)
public interface CommunityView {

    String getLogo();

    String getTitle();

    String getAlias();

    UserView getCreatedBy();

    String getDescription();

    Instant getCreatedAt();

}
