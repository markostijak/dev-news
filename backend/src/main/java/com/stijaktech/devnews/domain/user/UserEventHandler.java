package com.stijaktech.devnews.domain.user;

import org.springframework.data.rest.core.annotation.HandleBeforeCreate;
import org.springframework.data.rest.core.annotation.RepositoryEventHandler;

@RepositoryEventHandler
public class UserEventHandler {

    @HandleBeforeCreate
    public void beforeCreate(User user) {

    }

}