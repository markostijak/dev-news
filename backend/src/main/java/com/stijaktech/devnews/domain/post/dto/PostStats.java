package com.stijaktech.devnews.domain.post.dto;

import com.stijaktech.devnews.domain.post.Post;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;


@Projection(name = "stats", types = Post.class)
public interface PostStats extends PostView {

    @Value("#{@commentRepository.countByPost(target)}")
    long getCommentsCount();

}
