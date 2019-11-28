package com.stijaktech.devnews.domain.post;

import com.stijaktech.devnews.domain.community.Community;
import com.stijaktech.devnews.domain.community.CommunityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.core.annotation.HandleAfterCreate;
import org.springframework.data.rest.core.annotation.HandleAfterDelete;
import org.springframework.data.rest.core.annotation.HandleBeforeCreate;
import org.springframework.data.rest.core.annotation.RepositoryEventHandler;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.function.UnaryOperator;

@Component
@RepositoryEventHandler
public class PostEventHandler {

    private PostRepository postRepository;
    private CommunityRepository communityRepository;

    @Autowired
    public PostEventHandler(PostRepository postRepository, CommunityRepository communityRepository) {
        this.postRepository = postRepository;
        this.communityRepository = communityRepository;
    }

    @HandleBeforeCreate
    public void beforeCreate(Post post) {
        Community community = post.getCommunity();
        String original = post.getTitle().toLowerCase();
        original = original.replaceAll("[^\\p{IsAlphabetic}\\p{IsDigit}\\- ]", "");
        original = original.replace(" ", "-");

        String alias = original;
        for (int i = 1; postRepository.existsByAlias(alias); i++) {
            alias = original + "-" + i;
        }

        post.setAlias(alias);
        post.setCommunityId(community.getId());
    }

    @HandleAfterCreate
    public void afterCreate(Post post) {
        updateCommentsCount(post, c -> c + 1);
    }

    @HandleAfterDelete
    public void afterDelete(Post post) {
        updateCommentsCount(post, c -> c - 1);
    }

    private void updateCommentsCount(Post post, UnaryOperator<Integer> operator) {
        Community community = post.getCommunity();
        int count = operator.apply(post.getCommentsCount());
        community.setPostsCount(Math.max(count, 0));
        communityRepository.saveAll(List.of(community));
    }

}
