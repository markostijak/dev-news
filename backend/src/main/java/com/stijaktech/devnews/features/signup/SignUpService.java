package com.stijaktech.devnews.features.signup;

import com.stijaktech.devnews.domain.Status;
import com.stijaktech.devnews.domain.user.User;
import com.stijaktech.devnews.domain.user.UserRepository;
import com.stijaktech.devnews.domain.user.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Objects;

@Service
public class SignUpService {

    private UserService userService;
    private JavaMailSender mailSender;
    private UserRepository userRepository;

    public SignUpService(UserService userService, JavaMailSender mailSender, UserRepository userRepository) {
        this.mailSender = mailSender;
        this.userService = userService;
        this.userRepository = userRepository;
    }

    public User activate(User user, String activationCode) {
        if (!Objects.equals(user.getActivationCode(), activationCode)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }

        if (user.getStatus() == Status.ACTIVE) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        }

        return user;
    }

    public User create(User user) {
        user = userService.create(user);
        sendMail(user.getEmail(), user.getActivationCode());
        return user;
    }

    public void resendActivationCode(User user) {
        if (user.getStatus() != Status.AWAITING_ACTIVATION) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }

        sendMail(user.getEmail(), user.getActivationCode());
    }

    private void sendMail(String email, String activationCode) {
        MimeMessageHelper messageHelper = new MimeMessageHelper(mailSender.createMimeMessage());



        mailSender.send(messageHelper.getMimeMessage());
    }

}
