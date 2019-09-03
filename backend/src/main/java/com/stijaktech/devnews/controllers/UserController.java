package com.stijaktech.devnews.controllers;

import com.stijaktech.devnews.models.User;
import com.stijaktech.devnews.repositories.CommunityRepository;
import com.stijaktech.devnews.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping({"/users", "/u"})
public class UserController {

    private UserService userService;
    private CommunityRepository communityRepository;

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

    @GetMapping("/join")
    public ResponseEntity join(@RequestParam("id") String community) {
        boolean b = communityRepository.findById(community).map(userService::join).orElse(false);
        return b ? ResponseEntity.ok().build() : ResponseEntity.badRequest().build();
    }

    @DeleteMapping("/leave")
    public ResponseEntity leave(@RequestParam("id") String community) {
        boolean b = communityRepository.findById(community).map(userService::leave).orElse(false);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

}
