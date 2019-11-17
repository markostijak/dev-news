package com.stijaktech.devnews.domain.user;

import com.stijaktech.devnews.domain.AuthorAwarePermissionEvaluator;
import com.stijaktech.devnews.domain.community.Community;
import com.stijaktech.devnews.domain.community.CommunityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.core.annotation.HandleAfterLinkDelete;
import org.springframework.data.rest.core.annotation.HandleAfterLinkSave;
import org.springframework.data.rest.core.annotation.HandleBeforeLinkDelete;
import org.springframework.data.rest.core.annotation.HandleBeforeLinkSave;
import org.springframework.data.rest.core.annotation.RepositoryEventHandler;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.PermissionEvaluator;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;
import java.util.function.UnaryOperator;

@Component
@RepositoryEventHandler
public class UserEventHandler {

    private PermissionEvaluator evaluator;
    private CommunityRepository communityRepository;

    @Autowired
    public UserEventHandler(AuthorAwarePermissionEvaluator evaluator, CommunityRepository communityRepository) {
        this.evaluator = evaluator;
        this.communityRepository = communityRepository;
    }

    @HandleBeforeLinkSave
    public void beforeLinkSave(User user, Set<Community> communities) {
        Authentication authentication = authentication();
        if (!evaluator.hasPermission(authentication, user, "WRITE")) {
            throw new AccessDeniedException("WRITE");
        }
    }

    @HandleBeforeLinkDelete
    public void beforeLinkDelete(User user, Set<Community> communities) {
        Authentication authentication = authentication();
        if (!evaluator.hasPermission(authentication, user, "DELETE")) {
            throw new AccessDeniedException("DELETE");
        }
    }
/*
    @HandleAfterLinkSave
    public void afterLinkSave(User user, Set<Community> communities) {
        User principal = principal();
        Set<Community> difference = new HashSet<>(communities);
        difference.removeAll(principal.getCommunities());
        updateMembersCount(difference, c -> c + 1);
        principal.setCommunities(communities);
    }

    @HandleAfterLinkDelete
    public void afterLinkDelete(User user, Set<Community> communities) {
        User principal = principal();
        Set<Community> difference = new HashSet<>(principal.getCommunities());
        difference.removeAll(communities);
        updateMembersCount(difference, c -> c - 1);
        principal.setCommunities(communities);
    }

    private void updateMembersCount(Set<Community> difference, UnaryOperator<Integer> operator) {
        difference.forEach(community -> {
            int count = operator.apply(community.getMembersCount());
            community.setMembersCount(Math.max(count, 0));
        });

        communityRepository.saveAll(difference);
    }

*/

    private Authentication authentication() {
        return SecurityContextHolder.getContext().getAuthentication();
    }

    private User principal() {
        return (User) authentication().getPrincipal();
    }

}
