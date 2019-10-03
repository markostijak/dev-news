package com.stijaktech.devnews.domain.post;

import com.stijaktech.devnews.domain.community.Community;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Repository;

import java.util.Set;

@Repository
@RepositoryRestResource
public interface PostRepository extends MongoRepository<Post, String> {

    Page<Post> findAllByCommunityId(@Param("id") String id, Pageable pageable);

    Page<Post> findAllByCommunity(@Param("community") Community community, Pageable pageable);

    long countByCommunity(@Param("community") Community community);

    @RestResource(exported = false)
    Page<Post> findAllByCommunityIn(Set<Community> communities, Pageable pageable);

    Post findByAlias(@Param("alias") String alias);

    boolean existsByAlias(String alias);

    @Override
    @PreAuthorize("hasPermission(#entity, 'WRITE')")
    <S extends Post> S save(S entity);

    @Override
    @PreAuthorize("hasPermission(#entity, 'DELETE')")
    void delete(Post entity);

}
