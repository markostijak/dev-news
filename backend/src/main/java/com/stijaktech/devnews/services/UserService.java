package com.stijaktech.devnews.services;

import com.stijaktech.devnews.models.Privilege;
import com.stijaktech.devnews.models.Role;
import com.stijaktech.devnews.models.Status;
import com.stijaktech.devnews.models.User;
import com.stijaktech.devnews.repositories.UserRepository;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.keygen.KeyGenerators;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
public class UserService implements UserDetailsService {

    private UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User create(User user) {
        return user;
    }

    public User update(User user) {
        return user;
    }

    public User createOrUpdate(User user, String authorizationCode) {
        return userRepository.findByEmail(user.getEmail()).map(existing -> {
            existing.setPicture(user.getPicture());
            existing.setLastName(user.getLastName());
            existing.setProvider(user.getProvider());
            existing.setFirstName(user.getFirstName());
            existing.setActivationCode(authorizationCode);
            userRepository.save(existing);
            return existing;
        }).orElseGet(() -> {
            user.setRole(Role.USER);
            user.setStatus(Status.ACTIVE);
            user.setResetToken(KeyGenerators.string().generateKey());
            user.setPrivileges(Set.of(Privilege.READ, Privilege.WRITE));
            user.setActivationCode(KeyGenerators.string().generateKey());
            userRepository.save(user);
            return user;
        });
    }

    @Override
    public User loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException(username));
    }

}
