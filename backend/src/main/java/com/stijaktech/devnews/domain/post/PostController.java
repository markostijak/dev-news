package com.stijaktech.devnews.domain.post;

import com.stijaktech.devnews.domain.ProjectionService;
import com.stijaktech.devnews.domain.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalUnit;
import java.util.List;

@SuppressWarnings("unchecked")
@RepositoryRestController
public class PostController {

    private PostRepository postRepository;
    private ProjectionService projectionService;

    @Autowired
    public PostController(PostRepository postRepository, ProjectionService projectionService) {
        this.postRepository = postRepository;
        this.projectionService = projectionService;
    }

    @ResponseBody
    @GetMapping("/posts/search/findForUser")
    public PagedModel<EntityModel<?>> findForUser(
            @RequestParam("user") User user,
            @RequestParam(name = "projection", required = false) String projection,
            Pageable pageable, PagedResourcesAssembler assembler) {

        Page<?> posts = postRepository.findAllByCommunityIn(user.getCommunities(), pageable);

        if (projectionService.hasProjection(Post.class, projection)) {
            posts = projectionService.createProjection(posts, Post.class, projection);
        }
        return assembler.toModel(posts);
    }

}
