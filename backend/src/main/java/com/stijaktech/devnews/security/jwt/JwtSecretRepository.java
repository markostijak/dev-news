package com.stijaktech.devnews.security.jwt;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface JwtSecretRepository extends MongoRepository<JwtSecret, String> {

    Optional<JwtSecret> findById(String id);

    @Query("{ $sample: { size: 1 }}")
    Optional<JwtSecret> findAny();

}
