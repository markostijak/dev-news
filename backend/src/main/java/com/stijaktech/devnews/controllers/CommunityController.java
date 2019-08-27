package com.stijaktech.devnews.controllers;

import com.stijaktech.devnews.models.Community;
import com.stijaktech.devnews.models.User;
import com.stijaktech.devnews.repositories.CommunityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping({"/discussions", "/d"})
public class CommunityController {

    private CommunityRepository communityRepository;

    @Autowired
    public CommunityController(CommunityRepository communityRepository) {
        this.communityRepository = communityRepository;
    }

    @GetMapping("/all")
    public List<Community> all() {
        return communityRepository.findAll();
    }

    @GetMapping("/popular")
    public List<Community> popular() {
        return communityRepository.findPopular();
    }

    @GetMapping("/{title}")
    public Community view(@PathVariable("title") String title) {
        return communityRepository.findByTitle(title).orElseThrow(() -> new IllegalArgumentException("Title not found"));
    }

    @GetMapping("/home")
    public List<Community> home(@AuthenticationPrincipal User user) {
        return communityRepository.findForUser(user);
    }

    @PostMapping("/create")
    public Community create(@RequestBody Community community) {
        return null;
    }

    @PostMapping("/update")
    public Community update(@RequestBody Community community) {
        return null;
    }

}
