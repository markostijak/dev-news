package com.stijaktech.devnews.domain.post;

import com.stijaktech.devnews.domain.community.Community;
import com.stijaktech.devnews.domain.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.rest.webmvc.PersistentEntityResourceAssembler;
import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@SuppressWarnings("all")
@RepositoryRestController
public class PostController {

    private final PostRepository postRepository;

    public PostController(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    @GetMapping("/users/{id}/posts")
    public ResponseEntity<?> userPosts(@PathVariable("id") User user, Pageable pageable,
                                       PagedResourcesAssembler pagedAssembler,
                                       PersistentEntityResourceAssembler entityAssembler) {
        Page<Post> posts = postRepository.findAllByCommunityIn(user.getCommunities(), pageable);
        return ResponseEntity.ok(toPagedModel(posts, pagedAssembler, entityAssembler));
    }

    @GetMapping("/users/{id}/created-posts")
    public ResponseEntity<?> userCreatedPosts(@PathVariable("id") User user, Pageable pageable,
                                              PagedResourcesAssembler pagedAssembler,
                                              PersistentEntityResourceAssembler entityAssembler) {
        Page<Post> posts = postRepository.findAllByCreatedBy(user, pageable);
        return ResponseEntity.ok(toPagedModel(posts, pagedAssembler, entityAssembler));
    }

    @GetMapping("/communities/{id}/posts")
    public ResponseEntity<?> communityPosts(@PathVariable("id") Community community, Pageable pageable,
                                            PagedResourcesAssembler pagedAssembler,
                                            PersistentEntityResourceAssembler entityAssembler) {
        Page<Post> posts = postRepository.findAllByCommunity(community, pageable);
        return ResponseEntity.ok(toPagedModel(posts, pagedAssembler, entityAssembler));
    }

    private PagedModel<?> toPagedModel(Page<Post> posts, PagedResourcesAssembler pagedAssembler,
                                       PersistentEntityResourceAssembler entityAssembler) {
        if (posts.isEmpty()) {
            return pagedAssembler.toEmptyModel(posts, Post.class);
        }

        return pagedAssembler.toModel(posts, entityAssembler);
    }

}
