package com.stijaktech.devnews.features.authentication.jwt;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.rest.core.annotation.RestResource;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RestResource(exported = false)
public interface JwtSecretRepository extends MongoRepository<JwtSecret, String> {

    Optional<JwtSecret> findById(String id);

    List<JwtSecret> findAll();

}
