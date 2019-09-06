package com.stijaktech.devnews.services;

import com.stijaktech.devnews.models.Community;
import com.stijaktech.devnews.models.Status;
import com.stijaktech.devnews.models.User;
import com.stijaktech.devnews.repositories.CommunityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

import static com.stijaktech.devnews.exceptions.ModelException.ModelAlreadyPresentException;
import static com.stijaktech.devnews.exceptions.ModelException.ModelNotFoundException;

@Service
public class CommunityService {

    private CommunityRepository communityRepository;

    @Autowired
    public CommunityService(CommunityRepository communityRepository) {
        this.communityRepository = communityRepository;
    }

    public Community create(Community community) {
        String alias = community.getTitle().toLowerCase().replace(" ", "-");

        communityRepository.findByAlias(alias).ifPresent(c -> {
            throw new ModelAlreadyPresentException(community.getId());
        });

        community.setAlias(alias);
        community.setStatus(Status.ACTIVE);

        return communityRepository.save(community);
    }

    public List<Community> topCommunities(int start, int count) {
        return communityRepository.findAllByOrderByMembersDesc(PageRequest.of(start, start + count)).getContent();
    }

    public Community getByIdOrAlias(String idOrAlias) {
        return communityRepository.findByIdOrAlias(idOrAlias, idOrAlias).orElseThrow(() -> {
            throw new ModelNotFoundException(idOrAlias);
        });
    }

    public void delete(User user, String id) {
        Community community = communityRepository.findByIdOrAlias(id, id).orElseThrow(() -> new ModelNotFoundException(id));

        // check permissions

        community.setStatus(Status.DELETED);
        communityRepository.save(community);
    }

    public Community update(User user, Community community) {
        return communityRepository.save(community);
    }

}
