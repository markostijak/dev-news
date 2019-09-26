package com.stijaktech.devnews.features.signup;

import com.stijaktech.devnews.domain.ProjectionService;
import com.stijaktech.devnews.domain.user.User;
import com.stijaktech.devnews.domain.user.projections.UserPreviewProjection;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/sign-up")
public class SignUpController {

    private SignUpService signUpService;
    private ProjectionService projectionService;

    public SignUpController(SignUpService signUpService, ProjectionService projectionService) {
        this.signUpService = signUpService;
        this.projectionService = projectionService;
    }

    @PostMapping("/create")
    public EntityModel<UserPreviewProjection> signUp(@RequestBody User user) {
        user = signUpService.create(user);
        return project(user);
    }

    @PostMapping("/activation/activate")
    public EntityModel<UserPreviewProjection> activate(@RequestParam("user") User user, @RequestBody String activationCode) {
        user = signUpService.activate(user, activationCode);
        return project(user);
    }

    @PostMapping("/activation/resend")
    public ResponseEntity resend(@RequestParam("user") User user) {
        signUpService.resendActivationCode(user);
        return ResponseEntity.ok(HttpStatus.NO_CONTENT);
    }

    private EntityModel<UserPreviewProjection> project(User user) {
        return projectionService.createProjection(user, User.class, "user-preview");
    }

}
