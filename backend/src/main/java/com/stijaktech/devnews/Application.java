package com.stijaktech.devnews;

import com.stijaktech.devnews.configuration.security.jwt.JwtSecret;
import com.stijaktech.devnews.configuration.security.jwt.JwtSecretRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.keygen.KeyGenerators;

import java.util.List;

@SpringBootApplication
@AllArgsConstructor(onConstructor_ = @Autowired)
public class Application implements CommandLineRunner {

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

    private JwtSecretRepository jwtSecretRepository;

    @Override
    public void run(String... args) throws Exception {
        List<JwtSecret> jwtSecrets = jwtSecretRepository.findAll();
        if (jwtSecrets.isEmpty()) {
            for (int i = 0; i < 10; i++) {
                JwtSecret jwtSecret = new JwtSecret();
                jwtSecret.setValue(KeyGenerators.string().generateKey());
                jwtSecrets.add(jwtSecret);
            }
            jwtSecretRepository.saveAll(jwtSecrets);
        }
    }

}
