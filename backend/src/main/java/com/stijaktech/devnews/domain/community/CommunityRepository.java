package com.stijaktech.devnews.domain.community;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@RepositoryRestResource
public interface CommunityRepository extends MongoRepository<Community, String> {

    Optional<Community> findByAlias(@Param("alias") String alias);

}
