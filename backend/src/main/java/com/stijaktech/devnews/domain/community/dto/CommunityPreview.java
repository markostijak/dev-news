package com.stijaktech.devnews.domain.community.dto;

import com.stijaktech.devnews.domain.community.Community;
import org.springframework.data.rest.core.config.Projection;

@Projection(name = "preview", types = Community.class)
public interface CommunityPreview {

    String getLogo();

    String getTitle();

    String getAlias();

}
