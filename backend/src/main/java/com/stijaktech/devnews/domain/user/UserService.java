package com.stijaktech.devnews.domain.user;

import com.stijaktech.devnews.domain.Status;
import com.stijaktech.devnews.domain.community.CommunityRepository;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.keygen.KeyGenerators;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
public class UserService implements UserDetailsService {

    private UserRepository userRepository;
    private CommunityRepository communityRepository;

    public UserService(UserRepository userRepository, CommunityRepository communityRepository) {
        this.userRepository = userRepository;
        this.communityRepository = communityRepository;
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
            user.setActivationCode(authorizationCode);
            user.setUsername(createUsername(user));
            user.setResetToken(KeyGenerators.string().generateKey());
            user.setPrivileges(Set.of(Privilege.READ, Privilege.WRITE));
            userRepository.save(user);
            return user;
        });
    }

    @Override
    public User loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException(username));
    }

    private String createUsername(User user) {
        String original = (user.getFirstName() + "." + user.getLastName()).toLowerCase();

        String username = original;
        for (int i = 1; userRepository.existsByUsername(username); i++) {
            username = original + i;
        }

        return username;
    }

}
