package com.stijaktech.devnews.repositories;

import com.stijaktech.devnews.models.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

/**
 * Created by Marko Stijak on 04.07.2019.
 */
@Repository
public interface UserRepository extends MongoRepository<User, String> {
}
