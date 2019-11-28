package com.stijaktech.devnews.domain.comment;

import com.stijaktech.devnews.domain.post.Post;
import com.stijaktech.devnews.domain.post.PostRepository;
import org.springframework.data.rest.core.annotation.HandleAfterCreate;
import org.springframework.data.rest.core.annotation.HandleBeforeCreate;
import org.springframework.data.rest.core.annotation.RepositoryEventHandler;
import org.springframework.security.crypto.codec.Hex;
import org.springframework.security.crypto.keygen.BytesKeyGenerator;
import org.springframework.security.crypto.keygen.KeyGenerators;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.List;

@Component
@RepositoryEventHandler
public class CommentEventHandler {

    private BytesKeyGenerator generator;
    private PostRepository postRepository;

    public CommentEventHandler(PostRepository postRepository) {
        this.postRepository = postRepository;
        this.generator = KeyGenerators.secureRandom(3);
    }

    @HandleBeforeCreate
    public void beforeCreate(Comment comment) {
        Post post = comment.getPost();
        Comment parent = comment.getParent();
        String slug = generateKey();
        String fullSlug = String.format("%s:%s", Instant.now().toEpochMilli(), slug);

        comment.setPostId(post.getId());
        comment.setSlug((parent != null ? parent.getSlug() + "/" : "") + slug);
        comment.setFullSlug((parent != null ? parent.getFullSlug() + "/" : "") + fullSlug);
        comment.setParentId(parent != null ? parent.getId() : null);
    }

    @HandleAfterCreate
    public void afterCreate(Comment comment) {
        Post post = comment.getPost();
        post.setCommentsCount(post.getCommentsCount() + 1);
        postRepository.saveAll(List.of(post));
    }

    private String generateKey() {
        return new String(Hex.encode(generator.generateKey()));
    }

}
