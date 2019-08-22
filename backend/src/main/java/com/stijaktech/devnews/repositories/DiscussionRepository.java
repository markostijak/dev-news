package com.stijaktech.devnews.repositories;

import com.stijaktech.devnews.models.Discussion;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface DiscussionRepository extends MongoRepository<Discussion, String> {

}
