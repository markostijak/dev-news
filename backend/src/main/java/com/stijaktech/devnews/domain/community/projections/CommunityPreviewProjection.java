package com.stijaktech.devnews.domain.community.projections;

import com.stijaktech.devnews.domain.community.Community;
import org.springframework.data.rest.core.config.Projection;

@Projection(name = "preview", types = Community.class)
public interface CommunityPreviewProjection {

    String getId();

    String getLogo();

    String getTitle();

    String getAlias();

}
