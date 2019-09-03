package com.stijaktech.devnews.controllers;

import com.stijaktech.devnews.models.Community;
import com.stijaktech.devnews.models.CommunityForm;
import com.stijaktech.devnews.models.User;
import com.stijaktech.devnews.repositories.CommunityRepository;
import com.stijaktech.devnews.services.CommunityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping({"/communities", "/c"})
public class CommunityController {

    private CommunityService communityService;
    private CommunityRepository communityRepository;

    @Autowired
    public CommunityController(CommunityService communityService, CommunityRepository communityRepository) {
        this.communityService = communityService;
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

    @GetMapping("/{id}")
    public Community view(@PathVariable("id") String id) {
        return communityRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Title not found"));
    }

    @GetMapping("/home")
    public List<Community> home(@AuthenticationPrincipal User user) {
        return communityRepository.findForUser(user);
    }

    @GetMapping("/top-communities")
    public List<Community> topCommunities(
            @RequestParam(name = "start", required = false, defaultValue = "0") int start,
            @RequestParam(name = "count", required = false, defaultValue = "20") int count) {
        return communityService.topCommunities(start, count);
    }

    @PostMapping("/create")
    public Community create(CommunityForm communityForm) throws IOException {
        return communityService.create(communityForm);
    }

    @PostMapping("/update")
    public Community update(@RequestBody Community community) {
        return communityRepository.save(community);
    }

}
