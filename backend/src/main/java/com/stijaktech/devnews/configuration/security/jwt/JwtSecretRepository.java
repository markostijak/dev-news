package com.stijaktech.devnews.configuration.security.jwt;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JwtSecretRepository extends MongoRepository<JwtSecret, String> {

    Optional<JwtSecret> findById(String id);

    List<JwtSecret> findAll();

}
