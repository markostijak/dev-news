package com.stijaktech.devnews.domain.post;

import com.stijaktech.devnews.domain.community.Community;
import com.stijaktech.devnews.domain.post.dto.PostPreview;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;
import org.springframework.lang.NonNull;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
@RepositoryRestResource(excerptProjection = PostPreview.class)
public interface PostRepository extends MongoRepository<Post, String> {

    @NonNull
    @PreAuthorize("hasAnyRole('ADMIN', 'MODERATOR') or @am.isAuthor(#entity)")
    <S extends Post> S save(@NonNull S entity);

    @PreAuthorize("hasRole('ADMIN') or @am.isAuthor(#entity)")
    void delete(@NonNull Post entity);

    boolean existsByAlias(String alias);

    Post findByAlias(@Param("alias") String alias);

    @RestResource(exported = false)
    Page<Post> findAllByCommunityIn(Set<Community> communities, Pageable pageable);

    Page<Post> findAllByCommunity(@Param("community") Community community, Pageable pageable);

    long countByCommunity(@Param("community") Community community);

    @Aggregation(pipeline = {
            "{ $match: { communityId: { $eq: ?0 }}}",
            """
                     { $lookup: {
                         from: 'comments',
                         let: { postId: '$_id' },
                         pipeline: [
                             { $match: { createdAt: { $gte: ?#{T(java.time.Instant).now().minus(30, T(java.time.temporal.ChronoUnit).DAYS)} }}},
                             { $addFields: { postId: { '$toObjectId': '$postId' }}},
                             { $group: { _id: "$postId", count: { $sum: 1 } } },
                             { $match: { $expr: { $eq: [ '$_id', '$$postId' ]}}}
                         ],
                         as: 'comments'
                       }
                     }
                    """,
            "{ $unwind: '$comments' }",
            "{ $sort: { 'comments.count': -1 } }",
            "{ $project: { 'comments': 0 } }",
    })
    @Cacheable(cacheNames = "trending", cacheManager = "ttlCache", key = "#communityId")
    List<Post> findTrendingByCommunityId(@Param("communityId") String communityId, Pageable pageable);

    @Aggregation(pipeline = {
            """
                     { $lookup: {
                         from: 'comments',
                         let: { postId: '$_id' },
                         pipeline: [
                             { $match: { createdAt: { $gte: ?#{T(java.time.Instant).now().minus(7, T(java.time.temporal.ChronoUnit).DAYS)} }}},
                             { $addFields: { postId: { '$toObjectId': '$postId' }}},
                             { $group: { _id: "$postId", count: { $sum: 1 } } },
                             { $sort: { count: -1 } },
                             { $limit: 5 },
                             { $match: { $expr: { $eq: [ '$_id', '$$postId' ]}}}
                         ],
                         as: 'comments'
                       }
                     }
                    """,
            "{ $unwind: '$comments' }",
            "{ $sort: { 'comments.count': -1 } }",
            "{ $project: { 'comments': 0 } }"
    })
    @Cacheable(cacheNames = "trending", cacheManager = "ttlCache", key = "'posts'")
    List<Post> findTrending();

    @Aggregation(pipeline = {
            "{ $addFields: { date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } } } }",
            "{ $sort: { createdAt: -1 } }",
            "{ $group: { '_id': '$date', 'posts': { '$push': '$$ROOT' } } }",
            "{ $project: { posts: { $slice: ['$posts', 10] } } }",
            "{ $unwind: '$posts' }",
            "{ $replaceWith: '$posts' }",
            "{ $sort: { date: -1, commentsCount: -1 } }"
    })
    List<Post> findPopular(Pageable pageable);

}
