package com.stijaktech.devnews.domain.community;

import com.stijaktech.devnews.domain.ProjectionService;
import com.stijaktech.devnews.domain.post.Post;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@SuppressWarnings("unchecked")
@RepositoryRestController
public class CommunityController {

    private ProjectionService projectionService;
    private CommunityRepository communityRepository;

    @Autowired
    public CommunityController(ProjectionService projectionService, CommunityRepository communityRepository) {
        this.projectionService = projectionService;
        this.communityRepository = communityRepository;
    }

}
