package com.stijaktech.devnews.repositories;

import com.stijaktech.devnews.models.Community;
import com.stijaktech.devnews.models.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;
import java.util.Optional;

public interface CommunityRepository extends MongoRepository<Community, String> {

    @Query(value = "{}", fields = "{'posts':0}")
    Page<Community> findAll(Pageable pageable);

    Optional<Community> findByTitle(String title);

    List<Community> findByIdIn(List<String> ids);

    default List<Community> findForUser(User user) {
        return List.of();
    }

    default List<Community> findPopular() {
        return List.of();
    }

    @Query(value = "{}", fields = "{'posts':0}")
    Page<Community> findAllByOrderByMembersDesc(Pageable pageable);

}
