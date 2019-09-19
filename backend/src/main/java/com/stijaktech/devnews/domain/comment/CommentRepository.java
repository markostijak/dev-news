package com.stijaktech.devnews.domain.comment;

import com.stijaktech.devnews.domain.post.Post;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RepositoryRestResource
public interface CommentRepository extends MongoRepository<Comment, String> {

    List<Comment> findAllByPostId(@Param("id") String postId, Sort sort);

    List<Comment> findAllByPost(@Param("post") Post post, Sort sort);

    @RestResource(exported = false)
    List<Comment> findAllByPostOrderByCreatedAtAsc(Post post);

}
