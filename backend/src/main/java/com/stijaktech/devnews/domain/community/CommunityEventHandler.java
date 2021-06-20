package com.stijaktech.devnews.domain.community;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.core.annotation.HandleBeforeCreate;
import org.springframework.data.rest.core.annotation.RepositoryEventHandler;
import org.springframework.stereotype.Component;

@Component
@RepositoryEventHandler
public class CommunityEventHandler {

    private final CommunityRepository communityRepository;

    @Autowired
    public CommunityEventHandler(CommunityRepository communityRepository) {
        this.communityRepository = communityRepository;
    }

    @HandleBeforeCreate
    public void beforeCrete(Community community) {
        String alias = community.getAlias();

        if (alias == null) {
            alias = community.getTitle().toLowerCase();
        }

        alias = alias.replaceAll("[^\\p{IsAlphabetic}\\p{IsDigit}\\- ]", "");
        alias = alias.replace(" ", "-");

        String original = alias;
        for (int i = 1; communityRepository.existsByAlias(alias); i++) {
            alias = original + "-" + i;
        }

        community.setAlias(alias);
    }

}
