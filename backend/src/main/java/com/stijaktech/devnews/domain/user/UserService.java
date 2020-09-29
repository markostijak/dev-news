package com.stijaktech.devnews.domain.user;

import com.stijaktech.devnews.domain.ModelException.ModelAlreadyPresentException;
import com.stijaktech.devnews.domain.Status;
import com.stijaktech.devnews.features.authentication.Provider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.keygen.KeyGenerators;
import org.springframework.security.crypto.keygen.StringKeyGenerator;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final StringKeyGenerator stringKeyGenerator;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.stringKeyGenerator = KeyGenerators.string();
    }

    public User create(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new ModelAlreadyPresentException();
        }

        if (userRepository.existsByUsername(user.getUsername())) {
            throw new ModelAlreadyPresentException();
        }

        String activationCode = stringKeyGenerator.generateKey();

        user.setRole(Role.USER);
        user.setProvider(Provider.LOCAL);
        user.setActivationCode(activationCode);
        user.setStatus(Status.AWAITING_ACTIVATION);
        user.setPrivileges(Set.of(Privilege.READ));
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public User activate(User user, String activationCode) {
        user.setActivationCode(null);
        user.setPrivileges(Set.of(Privilege.READ, Privilege.WRITE, Privilege.DELETE));
        return userRepository.save(user);
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
            user.setUsername(createUsername(user));
            user.setActivationCode(authorizationCode);
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
