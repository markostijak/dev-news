package com.stijaktech.devnews.controllers;

import com.stijaktech.devnews.models.User;
import com.stijaktech.devnews.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by Marko Stijak on 04.07.2019.
 */
@RestController
public class UserController {

    private UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    public User create(User user) {
        return null;
    }

    public User edit(User user) {
        return null;
    }

    public User view(String id) {
        return null;
    }

}
