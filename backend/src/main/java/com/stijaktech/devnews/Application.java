package com.stijaktech.devnews;

import com.stijaktech.devnews.domain.Status;
import com.stijaktech.devnews.domain.user.Privilege;
import com.stijaktech.devnews.domain.user.Role;
import com.stijaktech.devnews.domain.user.User;
import com.stijaktech.devnews.domain.user.UserRepository;
import com.stijaktech.devnews.features.authentication.Provider;
import com.stijaktech.devnews.features.authentication.jwt.JwtSecret;
import com.stijaktech.devnews.features.authentication.jwt.JwtSecretRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.keygen.KeyGenerators;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Slf4j
@SpringBootApplication
@AllArgsConstructor(onConstructor_ = @Autowired)
public class Application implements CommandLineRunner {

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;
    private JwtSecretRepository jwtSecretRepository;

    @Override
    public void run(String... args) {
        List<JwtSecret> jwtSecrets = jwtSecretRepository.findAll();
        if (jwtSecrets.isEmpty()) {
            for (int i = 0; i < 10; i++) {
                JwtSecret jwtSecret = new JwtSecret();
                jwtSecret.setValue(KeyGenerators.string().generateKey());
                jwtSecrets.add(jwtSecret);
            }
            jwtSecretRepository.saveAll(jwtSecrets);
        }

        Optional<User> user = userRepository.findByUsername("webmaster");
        if (user.isEmpty()) {
            User webmaster = new User();
            webmaster.setRole(Role.WEBMASTER);
            webmaster.setUsername("webmaster");
            webmaster.setFirstName("webmaster");
            webmaster.setLastName("");
            webmaster.setEmail("webmaster@devnews.com");
            webmaster.setPassword(passwordEncoder.encode("webmaster"));
            webmaster.setPrivileges(Set.of(Privilege.READ));
            webmaster.setProvider(Provider.LOCAL);
            webmaster.setStatus(Status.ACTIVE);
            userRepository.save(webmaster);
        }
    }

}
