package com.stijaktech.devnews.domain.community;

import com.stijaktech.devnews.domain.comment.Comment;
import com.stijaktech.devnews.domain.community.dto.CommunityView;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;
import org.springframework.lang.NonNull;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Repository;

import javax.validation.constraints.Size;
import java.util.List;
import java.util.Optional;

@Repository
@RepositoryRestResource(excerptProjection = CommunityView.class)
public interface CommunityRepository extends MongoRepository<Community, String> {

    @NonNull
    @PreAuthorize("hasAnyRole('ADMIN', 'MODERATOR') or @am.isAuthor(#entity)")
    <S extends Comment> S save(@NonNull S entity);

    @RestResource(exported = false)
    void delete(@NonNull Community entity);

    Optional<Community> findByAlias(@Param("alias") String alias);

    boolean existsByAlias(String alias);

    @Aggregation(pipeline = {
            """
                     { $lookup: {
                         from: 'posts',
                         let: { communityId: '$_id' },
                         pipeline: [
                             { $match: { createdAt: { $gte: ?#{T(java.time.Instant).now().minus(7, T(java.time.temporal.ChronoUnit).DAYS)} }}},
                             { $addFields: { communityId: { '$toObjectId': '$communityId' }}},
                             { $group: { _id: "$communityId", count: { $sum: 1 } } },
                             { $sort: { count: -1 } },
                             { $limit: 5 },
                             { $match: { $expr: { $eq: [ '$_id', '$$communityId' ]}}}
                         ],
                         as: 'posts'
                       }
                     }
                    """,
            "{ $unwind: '$posts' }",
            "{ $sort: { 'posts.count': -1 } }",
            "{ $project: { 'posts': 0 } }"
    })
    @Cacheable(cacheNames = "trending", cacheManager = "ttlCache", key = "'communities'")
    List<Community> findTrending();

    List<Community> findByTitleStartsWithIgnoreCase(@Param("term") String term, Pageable pageable);

    @Aggregation("{ $sample: { size: ?0 } }")
    List<Community> findUpAndComing(@Size(min = 5, max = 100) @Param("size") int size);

}
