package com.stijaktech.devnews.domain.community.projections;

import com.stijaktech.devnews.domain.community.Community;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

@Projection(name = "include-stats", types = Community.class)
public interface IncludeStatsProjection {

    String getId();

    String getLogo();

    String getTitle();

    String getAlias();

    long getPostsCount();

    String getDescription();

    @Value("#{@userRepository.countByCommunitiesContaining(target)}")
    long getMembersCount();

}
