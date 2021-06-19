package com.stijaktech.devnews.domain.comment;

import com.stijaktech.devnews.domain.post.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.rest.webmvc.PersistentEntityResourceAssembler;
import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@SuppressWarnings("all")
@RepositoryRestController
public class CommentController {

    private final CommentRepository commentRepository;

    public CommentController(CommentRepository commentRepository) {
        this.commentRepository = commentRepository;
    }

    @GetMapping("/posts/{id}/comments")
    public ResponseEntity<?> comments(@PathVariable("id") Post post, Pageable pageable,
                                      PagedResourcesAssembler pagedAssembler,
                                      PersistentEntityResourceAssembler entityAssembler) {
        Page<Comment> comments = commentRepository.findAllByPostAndParentNull(post, pageable);
        return ResponseEntity.ok(pagedAssembler.toModel(comments, entityAssembler));
    }

    @GetMapping("/comments/{id}/replies")
    public ResponseEntity<?> replies(@PathVariable("id") Comment comment, Pageable pageable,
                                     PagedResourcesAssembler pagedAssembler,
                                     PersistentEntityResourceAssembler entityAssembler) {
        Page<Comment> comments = commentRepository.findAllByParent(comment, pageable);
        return ResponseEntity.ok(pagedAssembler.toModel(comments, entityAssembler));
    }

}
