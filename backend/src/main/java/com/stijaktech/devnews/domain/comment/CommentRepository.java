package com.stijaktech.devnews.domain.comment;

import com.stijaktech.devnews.domain.post.Post;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RepositoryRestResource
@SuppressWarnings("SpringCacheAnnotationsOnInterfaceInspection")
public interface CommentRepository extends MongoRepository<Comment, String> {

    @Override
    @PreAuthorize("hasPermission(#entity, 'WRITE')")
    <S extends Comment> S save(S entity);

    @Override
    @PreAuthorize("hasPermission(#entity, 'DELETE')")
    void delete(Comment entity);

    List<Comment> findAllByPost(@Param("post") Post post, Sort sort);

    List<Comment> findAllByPostId(@Param("id") String postId, Sort sort);

    @Cacheable(cacheNames = "commentsCount", cacheManager = "ttlCache", key = "#post.id")
    int countByPost(@Param("post") Post post);

}
