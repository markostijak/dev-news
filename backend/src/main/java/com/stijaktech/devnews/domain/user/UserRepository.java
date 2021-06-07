package com.stijaktech.devnews.domain.user;

import com.stijaktech.devnews.domain.user.dto.UserView;
import org.jetbrains.annotations.NotNull;
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
    void delete(@NotNull User user);

    @RestResource(exported = false)
    <S extends User> S save(@NotNull S user);

    Optional<User> findByEmail(String email);

    Optional<User> findByUsername(String username);

    boolean existsByEmail(@Param("email") String email);

    boolean existsByUsername(@Param("username") String username);

}
