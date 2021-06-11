package com.stijaktech.devnews.domain.community.dto;

import com.stijaktech.devnews.domain.community.Community;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

@Projection(name = "stats", types = Community.class)
public interface CommunityStats extends CommunityView {

    @Value("#{@userRepository.countByCommunitiesContaining(target)}")
    long getMembersCount();

    @Value("#{@postRepository.countByCommunity(target)}")
    long getPostsCount();

}
