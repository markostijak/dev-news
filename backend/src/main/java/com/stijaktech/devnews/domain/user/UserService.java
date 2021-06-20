package com.stijaktech.devnews.domain.user;

import com.stijaktech.devnews.domain.ModelException.ModelAlreadyPresentException;
import com.stijaktech.devnews.domain.Status;
import com.stijaktech.devnews.domain.user.device.Device;
import com.stijaktech.devnews.domain.user.dto.UserCreate;
import com.stijaktech.devnews.domain.user.dto.UserPatch;
import com.stijaktech.devnews.domain.user.dto.UserUpdate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.keygen.KeyGenerators;
import org.springframework.security.crypto.keygen.StringKeyGenerator;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import javax.mail.MessagingException;
import java.util.Objects;
import java.util.Set;

import static com.stijaktech.devnews.domain.ModelException.UserActivationFailedException;
import static com.stijaktech.devnews.domain.ModelException.ModelNotFoundException;
import static com.stijaktech.devnews.domain.user.Privilege.DELETE;
import static com.stijaktech.devnews.domain.user.Privilege.READ;
import static com.stijaktech.devnews.domain.user.Privilege.WRITE;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JavaMailSender mailSender;
    private final StringKeyGenerator keyGenerator;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, JavaMailSender mailSender) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.mailSender = mailSender;
        this.keyGenerator = KeyGenerators.string();
    }

    public User create(UserCreate model) {
        if (userRepository.existsByEmail(model.getEmail())) {
            throw new ModelAlreadyPresentException(User.class);
        }

        if (userRepository.existsByUsername(model.getUsername())) {
            throw new ModelAlreadyPresentException(User.class);
        }

        String activationCode = keyGenerator.generateKey();

        User user = new User();
        user.setRole(Role.USER);
        user.setProvider(Provider.LOCAL);
        user.setEmail(model.getEmail());
        user.setUsername(model.getUsername());
        user.setFirstName(model.getFirstName());
        user.setLastName(model.getLastName());
        user.setStatus(Status.AWAITING_ACTIVATION);
        user.setPrivileges(Set.of(READ));
        user.setPassword(passwordEncoder.encode(model.getPassword()));
        user.setResetToken(keyGenerator.generateKey());
        user.setActivationCode(activationCode);
        user = userRepository.save(user);

        sendMail(user.getEmail(), activationCode);

        return user;
    }

    public User createFromOAuthProvider(User model, String authorizationCode) {
        User user = userRepository.findByEmail(model.getEmail()).orElse(null);

        if (user != null) {
            //user.setPicture(model.getPicture());
            user.setLastName(model.getLastName());
            user.setProvider(model.getProvider());
            user.setFirstName(model.getFirstName());
            user.setActivationCode(authorizationCode);
            return userRepository.save(user);
        }

        model.setRole(Role.USER);
        model.setStatus(Status.ACTIVE);
        model.setUsername(createUsername(model));
        model.setActivationCode(authorizationCode);
        model.setPrivileges(Set.of(READ, WRITE, DELETE));
        model.setResetToken(keyGenerator.generateKey());
        return userRepository.save(model);
    }

    public boolean activate(User user, String activationCode) {
        if (user.getStatus() != Status.AWAITING_ACTIVATION) {
            throw new UserActivationFailedException();
        }

        if (!Objects.equals(user.getActivationCode(), activationCode)) {
            throw new UserActivationFailedException();
        }

        user.setActivationCode(null);
        user.setStatus(Status.ACTIVE);
        user.setPrivileges(Set.of(READ, WRITE, DELETE));
        userRepository.save(user);

        return true;
    }

    public boolean resendActivationCode(User user) {
        if (user.getStatus() != Status.AWAITING_ACTIVATION) {
            throw new UserActivationFailedException();
        }

        String activationCode = keyGenerator.generateKey();
        user.setActivationCode(activationCode);
        userRepository.save(user);

        return sendMail(user.getEmail(), activationCode);
    }

    public User update(User user, UserUpdate model) {
        user.setFirstName(model.getFirstName());
        user.setLastName(model.getLastName());
        user.setUsername(model.getUsername());
        user.setPicture(model.getPicture());

        return userRepository.save(user);
    }

    public User patch(User user, UserPatch model) {
        if (model.getFirstName() != null) {
            user.setFirstName(model.getFirstName());
        }

        if (model.getLastName() != null) {
            user.setLastName(model.getLastName());
        }

        if (model.getUsername() != null) {
            user.setUsername(model.getUsername());
        }

        if (model.getPicture() != null) {
            user.setPicture(model.getPicture());
        }

        return userRepository.save(user);
    }

    public User getByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ModelNotFoundException("User" + username + " not found"));
    }

    public boolean revokeDevice(User user, String token) {
        Set<Device> devices = user.getDevices();

        boolean result = devices.removeIf(d -> d.getToken().equals(token));

        userRepository.save(user);

        return result;
    }

    private String createUsername(User user) {
        String original = (user.getFirstName() + "." + user.getLastName()).toLowerCase();

        String username = original;
        for (int i = 1; userRepository.existsByUsername(username); i++) {
            username = original + i;
        }

        return username;
    }

    private boolean sendMail(String email, String activationCode) {
        try {
            MimeMessageHelper messageHelper = new MimeMessageHelper(mailSender.createMimeMessage());
            messageHelper.setTo(email);
            messageHelper.setSubject("Dew-News Activation Code");
            messageHelper.setText("Your activation code: " + activationCode);
            mailSender.send(messageHelper.getMimeMessage());
            return true;
        } catch (MessagingException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
