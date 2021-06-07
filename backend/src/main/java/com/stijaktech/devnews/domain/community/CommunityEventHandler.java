package com.stijaktech.devnews.domain.community;

import org.springframework.data.rest.core.annotation.HandleBeforeSave;
import org.springframework.data.rest.core.annotation.RepositoryEventHandler;
import org.springframework.stereotype.Component;

@Component
@RepositoryEventHandler
public class CommunityEventHandler {

    @HandleBeforeSave
    public void beforeSave(Community community) {
        String alias = community.getAlias();

        if (alias == null) {
            alias = community.getTitle().toLowerCase().replace(" ", "-");
        }

        community.setAlias(alias);
    }

}
