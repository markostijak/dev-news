package com.stijaktech.devnews.domain.user;

import com.stijaktech.devnews.domain.community.Community;
import com.stijaktech.devnews.domain.post.Post;
import com.stijaktech.devnews.domain.user.projections.UserProjection;
import org.springframework.cache.annotation.CacheConfig;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@CacheConfig(cacheNames = "users")
@SuppressWarnings("SpringCacheAnnotationsOnInterfaceInspection")
@RepositoryRestResource(excerptProjection = UserProjection.class)
public interface UserRepository extends MongoRepository<User, String> {

    @Caching(evict = {
            @CacheEvict(key = "#entity.id"),
            @CacheEvict(key = "#entity.email"),
            @CacheEvict(key = "#entity.username")
    })
    User save(User entity);

    @Caching(evict = {
            @CacheEvict(key = "#entity.id"),
            @CacheEvict(key = "#entity.email"),
            @CacheEvict(key = "#entity.username")
    })
    @PreAuthorize("hasPermission(#entity, 'DELETE')")
    void delete(User entity);

    @Cacheable
    Optional<User> findById(String id);

    @Cacheable
    Optional<User> findByEmail(String email);

    @Cacheable
    Optional<User> findByUsername(String username);

    boolean existsByEmail(@Param("email") String email);

    boolean existsByUsername(@Param("username") String username);

    @Cacheable(cacheNames = "membersCount", cacheManager = "ttlCache", key = "#community.id")
    int countByCommunitiesContaining(@Param("community") Community community);

}
