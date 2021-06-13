package com.stijaktech.devnews.domain.comment;

import com.stijaktech.devnews.domain.post.Post;
import com.stijaktech.devnews.domain.post.PostRepository;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.core.annotation.HandleBeforeCreate;
import org.springframework.data.rest.core.annotation.RepositoryEventHandler;
import org.springframework.security.crypto.codec.Hex;
import org.springframework.security.crypto.keygen.BytesKeyGenerator;
import org.springframework.security.crypto.keygen.KeyGenerators;
import org.springframework.stereotype.Component;

import java.time.Clock;

@Component
@RepositoryEventHandler
public class CommentEventHandler {

    private final BytesKeyGenerator generator;
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;

    @Setter(onMethod_ = @Autowired(required = false))
    private Clock clock = Clock.systemDefaultZone();

    public CommentEventHandler(PostRepository postRepository, CommentRepository commentRepository) {
        this.postRepository = postRepository;
        this.commentRepository = commentRepository;
        this.generator = KeyGenerators.secureRandom(3);
    }

    @HandleBeforeCreate
    public void beforeCreate(Comment comment) {
        Post post = comment.getPost();
        Comment parent = comment.getParent();

        String slug = generateKey();
        String fullSlug = String.format("%s:%s", clock.millis(), slug);

        comment.setSlug((parent != null ? parent.getSlug() + "/" : "") + slug);
        comment.setFullSlug((parent != null ? parent.getFullSlug() + "/" : "") + fullSlug);
    }

    private String generateKey() {
        return new String(Hex.encode(generator.generateKey()));
    }

}
