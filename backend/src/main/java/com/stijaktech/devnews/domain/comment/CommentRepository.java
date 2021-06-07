package com.stijaktech.devnews.domain.comment;

import com.stijaktech.devnews.domain.post.Post;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RepositoryRestResource
public interface CommentRepository extends MongoRepository<Comment, String> {

    @NotNull
    @PreAuthorize("hasAnyRole('ADMIN', 'MODERATOR') or @am.isAuthor(#entity)")
    <S extends Comment> S save(@NotNull S entity);

    @PreAuthorize("hasRole('ADMIN') or @am.isAuthor(#entity)")
    void delete(@NotNull Comment entity);

    List<Comment> findAllByPost(@Param("post") Post post, Sort sort);

    List<Comment> findAllByPostId(@Param("id") String postId, Sort sort);

    int countByPost(@Param("post") Post post);

}
