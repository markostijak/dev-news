package com.stijaktech.devnews.repositories;

import com.stijaktech.devnews.models.Community;
import com.stijaktech.devnews.models.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface CommunityRepository extends MongoRepository<Community, String> {

    Optional<Community> findByTitle(String title);

    List<Community> findForUser(User user);

    List<Community> findPopular();

}
