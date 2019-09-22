package com.stijaktech.devnews.domain.comment;

import org.springframework.data.rest.core.annotation.HandleBeforeCreate;
import org.springframework.data.rest.core.annotation.RepositoryEventHandler;
import org.springframework.security.crypto.codec.Hex;
import org.springframework.security.crypto.keygen.BytesKeyGenerator;
import org.springframework.security.crypto.keygen.KeyGenerators;
import org.springframework.stereotype.Component;

import java.time.Instant;

@Component
@RepositoryEventHandler
public class CommentEventHandler {

    private BytesKeyGenerator generator;

    public CommentEventHandler() {
        this.generator = KeyGenerators.secureRandom(3);
    }

    @HandleBeforeCreate
    public void beforeCreate(Comment comment) {
        Comment parent = comment.getParent();
        String slug = generateKey();
        String fullSlug = String.format("%s:%s", Instant.now().toEpochMilli(), slug);

        comment.setSlug((parent != null ? parent.getSlug() + "/" : "") + slug);
        comment.setFullSlug((parent != null ? parent.getFullSlug() + "/" : "") + fullSlug);
        comment.setParentId(parent != null ? parent.getId() : null);
    }

    private String generateKey() {
        return new String(Hex.encode(generator.generateKey()));
    }

}
