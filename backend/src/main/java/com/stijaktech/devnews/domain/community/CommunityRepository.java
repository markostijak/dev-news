package com.stijaktech.devnews.domain.community;

import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RepositoryRestResource
public interface CommunityRepository extends MongoRepository<Community, String> {

    Optional<Community> findByAlias(@Param("alias") String alias);

    List<Community> findByTitleStartsWithIgnoreCase(@Param("term") String term, Sort sort);

    @Override
    @PreAuthorize("hasPermission(#entity, 'WRITE')")
    <S extends Community> S save(S entity);

    @Override
    @PreAuthorize("hasPermission(#entity, 'DELETE')")
    void delete(Community entity);

}
