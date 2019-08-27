package com.stijaktech.devnews.controllers;

import com.stijaktech.devnews.models.User;
import com.stijaktech.devnews.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping({"/users", "/u"})
public class UserController {

    private UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/create")
    public User create(@RequestBody User user) {
        return new User();
    }

    @PostMapping("/update")
    public User update(@RequestBody User user) {
        return new User();
    }

    @PostMapping("/{id}")
    public User view(@PathVariable String id) {
        return new User();
    }

}
