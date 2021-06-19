package com.stijaktech.devnews.domain.user;

import com.stijaktech.devnews.domain.ModelAssembler;
import com.stijaktech.devnews.domain.user.dto.UserAccount;
import com.stijaktech.devnews.domain.user.dto.UserCreate;
import com.stijaktech.devnews.domain.user.dto.UserProfile;
import com.stijaktech.devnews.domain.user.dto.UserView;
import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.data.rest.webmvc.support.RepositoryEntityLinks;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.validation.Valid;

@Validated
@RepositoryRestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;
    private final RepositoryEntityLinks links;
    private final ModelAssembler modelAssembler;

    public UserController(UserService userService, RepositoryEntityLinks links, ModelAssembler modelAssembler) {
        this.userService = userService;
        this.links = links;
        this.modelAssembler = modelAssembler;
    }

    @PostMapping("")
    public ResponseEntity<EntityModel<UserAccount>> create(@Valid @RequestBody UserCreate model) {
        User user = userService.create(model);

        EntityModel<UserAccount> entityModel = modelAssembler.toModel(user, UserAccount.class);
        entityModel.add(links.linkForItemResource(user, User::getId).slash("activate").withRel("activate"));
        entityModel.add(links.linkForItemResource(user, User::getId).slash("activate/resend").withRel("resendActivationCode"));

        return ResponseEntity.status(HttpStatus.CREATED).body(entityModel);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EntityModel<UserView>> view(@PathVariable("id") User user) {
        return ResponseEntity.ok(modelAssembler.toModel(user, UserView.class));
    }

    @GetMapping(path = "/{id}", params = "projection=account")
    @PreAuthorize("hasAnyRole('ADMIN', 'MODERATOR') or @am.isAuthor(#user)")
    public ResponseEntity<EntityModel<UserAccount>> viewAccount(@PathVariable("id") User user) {
        EntityModel<UserAccount> entityModel = modelAssembler.toModel(user, UserAccount.class);
        entityModel.add(links.linkForItemResource(user, User::getId).slash("posts").withRel("posts"));

        return ResponseEntity.ok(entityModel);
    }

    @GetMapping(path = "/{id}", params = "projection=profile")
    @PreAuthorize("hasRole('ADMIN') or @am.isAuthor(#user)")
    public ResponseEntity<EntityModel<UserProfile>> viewProfile(@PathVariable("id") User user) {
        return ResponseEntity.ok(modelAssembler.toModel(user, UserProfile.class));
    }

    @PostMapping(path = "/{id}/activate")
    public ResponseEntity<?> activate(@PathVariable("id") User user, @RequestBody String activationCode) {
        userService.activate(user, activationCode);
        return ResponseEntity.ok(HttpStatus.NO_CONTENT);
    }

    @PostMapping("/{id}/activate/resend")
    public ResponseEntity<?> resend(@PathVariable("id") User user) {
        userService.resendActivationCode(user);
        return ResponseEntity.ok(HttpStatus.NO_CONTENT);
    }

}
