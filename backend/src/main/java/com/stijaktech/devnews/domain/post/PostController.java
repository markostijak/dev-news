package com.stijaktech.devnews.domain.post;

import com.stijaktech.devnews.domain.ProjectionService;
import com.stijaktech.devnews.domain.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.PagedResources;
import org.springframework.hateoas.Resource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@SuppressWarnings("unchecked")
@RequestMapping("/posts")
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
    @GetMapping("/search/findForUser")
    public PagedResources<Resource<?>> findForUser(
            @RequestParam("user") User user,
            @RequestParam(value = "projection", required = false) String projection,
            Pageable pageable, PagedResourcesAssembler assembler) {

        Page<?> posts = postRepository.findAllByCommunityIn(user.getCommunities(), pageable);

        if (projectionService.hasProjection(Post.class, projection)) {
            posts = projectionService.createProjection(posts, Post.class, projection);
        }

        return assembler.toResource(posts);
    }

    @ResponseBody
    @GetMapping("/search/findPopular")
    public PagedResources<Resource<?>> findPopular(
            @RequestParam(value = "projection", required = false) String projection,
            Pageable pageable, PagedResourcesAssembler assembler) {

        Page<?> posts = postRepository.findAll(pageable);

        if (projectionService.hasProjection(Post.class, projection)) {
            posts = projectionService.createProjection(posts, Post.class, projection);
        }

        return assembler.toResource(posts);
    }

}
