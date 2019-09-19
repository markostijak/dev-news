package com.stijaktech.devnews.features.authentication.oauth2;

import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProviderRepository {

    Optional<ProviderDetails> findByName(String name);

}
