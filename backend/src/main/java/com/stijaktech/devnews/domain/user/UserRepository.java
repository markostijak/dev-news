package com.stijaktech.devnews.domain.user;

import com.stijaktech.devnews.domain.community.Community;
import com.stijaktech.devnews.domain.user.dto.UserView;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@RepositoryRestResource(excerptProjection = UserView.class)
public interface UserRepository extends MongoRepository<User, String> {

    @RestResource(exported = false)
    void delete(User user);

    // todo move to controller
    <S extends User> S save(S user);

    @RestResource(exported = false)
    Optional<User> findByEmail(String email);

    @RestResource(exported = false)
    Optional<User> findByEmailOrUsername(String email, String username);

    Optional<User> findByUsername(@Param("username") String username);

    boolean existsByEmail(@Param("email") String email);

    boolean existsByUsername(@Param("username") String username);

    long countByCommunitiesContaining(Community community);

}
