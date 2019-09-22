package com.stijaktech.devnews.domain.user;

import com.stijaktech.devnews.domain.community.Community;
import com.stijaktech.devnews.domain.user.projections.UserProjection;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@RepositoryRestResource(excerptProjection = UserProjection.class)
public interface UserRepository extends MongoRepository<User, String> {

    Optional<User> findByEmail(String email);

    Optional<User> findByUsername(String username);

    boolean existsByUsername(String username);

    long countByCommunitiesContaining(@Param("community") Community community);

}
