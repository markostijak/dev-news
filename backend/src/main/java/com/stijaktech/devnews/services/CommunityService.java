package com.stijaktech.devnews.services;

import com.stijaktech.devnews.models.Community;
import com.stijaktech.devnews.models.CommunityForm;
import com.stijaktech.devnews.models.Status;
import com.stijaktech.devnews.models.User;
import com.stijaktech.devnews.repositories.CommunityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CommunityService {

    private ImageService imageService;
    private CommunityRepository communityRepository;

    @Autowired
    public CommunityService(ImageService imageService, CommunityRepository communityRepository) {
        this.imageService = imageService;
        this.communityRepository = communityRepository;
    }

    public Community create(CommunityForm communityForm) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Community community = Community.builder()
                .status(Status.ACTIVE)
                .createdBy(user.getId())
                .createdAt(LocalDateTime.now())
                .title(communityForm.getTitle())
                .description(communityForm.getDescription())
                .logo(imageService.storeImage(communityForm.getTitle(), communityForm.getLogo(), "community.svg"))
                .build();

        return communityRepository.save(community);
    }

    public List<Community> topCommunities(int start, int count) {
        return communityRepository.findAllByOrderByMembersDesc(PageRequest.of(start, start + count)).getContent();
    }

}
