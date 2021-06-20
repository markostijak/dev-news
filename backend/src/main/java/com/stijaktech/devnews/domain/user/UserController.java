package com.stijaktech.devnews.domain.user;

import com.stijaktech.devnews.domain.ModelAssembler;
import com.stijaktech.devnews.domain.user.dto.UserAccount;
import com.stijaktech.devnews.domain.user.dto.UserCreate;
import com.stijaktech.devnews.domain.user.dto.UserPatch;
import com.stijaktech.devnews.domain.user.dto.UserProfile;
import com.stijaktech.devnews.domain.user.dto.UserUpdate;
import com.stijaktech.devnews.domain.user.dto.UserView;
import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.data.rest.webmvc.support.RepositoryEntityLinks;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import javax.validation.Valid;
import javax.validation.constraints.Size;

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

        EntityModel<UserAccount> entityModel = project(user, UserAccount.class);
        entityModel.add(links.linkForItemResource(user, User::getId).slash("activate").withRel("activate"));
        entityModel.add(links.linkForItemResource(user, User::getId).slash("activate/resend").withRel("resendActivationCode"));

        return ResponseEntity.created(entityModel.getRequiredLink("self").toUri()).body(entityModel);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EntityModel<UserView>> view(@PathVariable("id") User user) {
        return ResponseEntity.ok(project(user, UserView.class));
    }

    @GetMapping(path = "/{id}", params = "projection=account")
    @PreAuthorize("hasAnyRole('ADMIN', 'MODERATOR') or @am.isAuthor(#user)")
    public ResponseEntity<EntityModel<UserAccount>> viewAccount(@PathVariable("id") User user) {
        return ResponseEntity.ok(project(user, UserAccount.class));
    }

    @GetMapping(path = "/{id}", params = "projection=profile")
    @PreAuthorize("hasRole('ADMIN') or @am.isAuthor(#user)")
    public ResponseEntity<EntityModel<UserProfile>> viewProfile(@PathVariable("id") User user) {
        return ResponseEntity.ok(project(user, UserProfile.class));
    }

    @PostMapping(path = "/{id}/activate")
    public ResponseEntity<?> activate(@PathVariable("id") User user, @RequestBody String activationCode) {
        userService.activate(user, activationCode);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/activate/resend")
    public ResponseEntity<?> resend(@PathVariable("id") User user) {
        userService.resendActivationCode(user);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @am.isAuthor(#user)")
    public ResponseEntity<?> update(@PathVariable("id") User user, @Valid @RequestBody UserUpdate model) {
        user = userService.update(user, model);
        return ResponseEntity.ok(project(user, UserAccount.class));
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @am.isAuthor(#user)")
    public ResponseEntity<?> patch(@PathVariable("id") User user, @RequestBody UserPatch model) {
        user = userService.patch(user, model);
        return ResponseEntity.ok(project(user, UserAccount.class));
    }

    @GetMapping("/search/findByUsername")
    public ResponseEntity<?> getByUsername(@RequestParam("username") @Size(min = 5, max = 64) String username) {
        User user = userService.getByUsername(username);
        return ResponseEntity.ok(project(user, UserView.class));
    }

    @DeleteMapping("/{id}/devices/{deviceId}")
    @PreAuthorize("hasRole('ADMIN') or @am.isAuthor(#user)")
    public ResponseEntity<?> revokeDevice(@PathVariable("id") User user, @PathVariable("deviceId") String device) {
        userService.revokeDevice(user, device);
        return ResponseEntity.noContent().build();
    }

    private <T> EntityModel<T> project(User user, Class<T> projection) {
        EntityModel<T> entityModel = modelAssembler.toModel(user, projection);
        entityModel.add(links.linkForItemResource(user, User::getId).slash("posts").withRel("posts"));
        entityModel.add(links.linkForItemResource(user, User::getId).slash("created-posts").withRel("createdPosts"));

        return entityModel;
    }

}
