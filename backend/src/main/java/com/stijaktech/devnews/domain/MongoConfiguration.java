package com.stijaktech.devnews.domain;

import com.stijaktech.devnews.domain.comment.Comment;
import com.stijaktech.devnews.domain.community.Community;
import com.stijaktech.devnews.domain.post.Post;
import com.stijaktech.devnews.domain.user.User;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.event.EventListener;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.index.IndexOperations;
import org.springframework.data.mongodb.core.index.IndexResolver;
import org.springframework.data.mongodb.core.index.MongoPersistentEntityIndexResolver;
import org.springframework.data.mongodb.core.mapping.MongoMappingContext;

import java.util.List;

@Configuration
public class MongoConfiguration {

    private MongoTemplate mongoTemplate;
    private MongoMappingContext mappingContext;

    public MongoConfiguration(MongoTemplate mongoTemplate, MongoMappingContext mappingContext) {
        this.mongoTemplate = mongoTemplate;
        this.mappingContext = mappingContext;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void initIndicesAfterStartup() {
        List.of(User.class, Community.class, Post.class, Comment.class).forEach(model -> {
            IndexOperations indexOps = mongoTemplate.indexOps(model);
            IndexResolver resolver = new MongoPersistentEntityIndexResolver(mappingContext);
            resolver.resolveIndexFor(model).forEach(indexOps::ensureIndex);
        });
    }

}
