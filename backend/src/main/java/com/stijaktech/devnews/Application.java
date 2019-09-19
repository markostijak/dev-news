package com.stijaktech.devnews;

import com.stijaktech.devnews.domain.Status;
import com.stijaktech.devnews.domain.community.Community;
import com.stijaktech.devnews.domain.community.CommunityRepository;
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
    private CommunityRepository communityRepository;

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
            webmaster.setEmail("webmaster@dev-news.com");
            webmaster.setPassword(passwordEncoder.encode("webmaster"));
            webmaster.setPicture("data:image/png;base64,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");
            webmaster.setPrivileges(Set.of(Privilege.READ));
            webmaster.setProvider(Provider.LOCAL);
            webmaster.setStatus(Status.ACTIVE);
            userRepository.save(webmaster);
        }

        List<Community> communities = communityRepository.findAll();
        if (communities.isEmpty()) {
            communityRepository.saveAll(List.of(
                    Community.builder()
                            .title("Java")
                            .alias("java")
                            .description("News, Technical discussions, research papers and assorted things of interest related to the Java programming language.")
                            .logo("http://localhost:9000/image_2844365315f87d17bfeab0c6e01da893.png")
                            .build(),
                    Community.builder()
                            .title("Angular")
                            .alias("angular")
                            .description("Content specific to Angular. Angular is Google's open source framework for crafting high-quality front-end web applications. This community exists to help spread news, discuss current developments and new features. Welcome!")
                            .logo("http://localhost:9000/image_ca26f009281bfb43a21797b018e0c0dc.png")
                            .build(),
                    Community.builder()
                            .title("Spring Framework")
                            .alias("spring-framework")
                            .description("The Spring Framework provides a comprehensive programming and configuration model for modern Java-based enterprise applications - on any kind of deployment platform. A key element of Spring is infrastructural support at the application level: Spring focuses on the \"plumbing\" of enterprise applications so that teams can focus on application-level business logic, without unnecessary ties to specific deployment environments.")
                            .logo("http://localhost:9000/image_8bbf24dad5367d1821caa35ad5d07f38.png")
                            .build()
            ));
        }
    }

}
