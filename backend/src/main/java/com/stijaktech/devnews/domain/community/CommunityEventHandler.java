package com.stijaktech.devnews.domain.community;

import org.springframework.data.rest.core.annotation.HandleBeforeCreate;
import org.springframework.data.rest.core.annotation.RepositoryEventHandler;
import org.springframework.stereotype.Component;

@Component
@RepositoryEventHandler
public class CommunityEventHandler {

    @HandleBeforeCreate
    public void beforeCrete(Community community) {
        String alias = community.getAlias();

        if (alias == null) {
            alias = community.getTitle().toLowerCase().replace(" ", "-");
        }

        community.setAlias(alias);
    }

}
