package com.stijaktech.devnews.domain.comment;

import com.stijaktech.devnews.domain.post.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;
import org.springframework.lang.NonNull;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Repository;

@Repository
@RepositoryRestResource
public interface CommentRepository extends MongoRepository<Comment, String> {

    @NonNull
    @PreAuthorize("hasAnyRole('ADMIN', 'MODERATOR') or @am.isAuthor(#entity)")
    <S extends Comment> S save(@NonNull S entity);

    @PreAuthorize("hasRole('ADMIN') or @am.isAuthor(#entity)")
    void delete(@NonNull Comment entity);

    Page<Comment> findAllByPostAndParentNull(Post post, Pageable pageable);

    Page<Comment> findAllByPost(Post post, Pageable pageable);

    Page<Comment> findAllByParent(Comment comment, Pageable pageable);

    @RestResource(exported = false)
    int countByPost(Post post);

}
