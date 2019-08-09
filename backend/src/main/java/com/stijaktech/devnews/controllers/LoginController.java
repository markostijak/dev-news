package com.stijaktech.devnews.controllers;

import com.stijaktech.devnews.models.Login;
import com.stijaktech.devnews.models.SocialLogin;
import com.stijaktech.devnews.models.User;
import com.stijaktech.devnews.services.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
public class LoginController {

    private LoginService loginService;

    @Autowired
    public LoginController(LoginService loginService) {
        this.loginService = loginService;
    }

    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody Login login) {
        User user = loginService.login(login);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/social-login")
    public ResponseEntity<User> socialLogin(@RequestBody SocialLogin socialLogin) {
        User user = loginService.login(socialLogin);
        return ResponseEntity.ok(user);
    }

}
