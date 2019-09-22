package com.stijaktech.devnews.features.authentication.jwt;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RepositoryRestResource(exported = false)
@SuppressWarnings("SpringCacheAnnotationsOnInterfaceInspection")
public interface JwtSecretRepository extends MongoRepository<JwtSecret, String> {

    @Cacheable(cacheNames = "jwtSecrets")
    Optional<JwtSecret> findById(String id);

    List<JwtSecret> findAll();

}
