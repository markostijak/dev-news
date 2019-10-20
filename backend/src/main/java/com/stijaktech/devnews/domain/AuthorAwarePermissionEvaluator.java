package com.stijaktech.devnews.domain;

import com.stijaktech.devnews.domain.user.Role;
import com.stijaktech.devnews.domain.user.User;
import org.springframework.security.access.PermissionEvaluator;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.io.Serializable;
import java.util.Objects;
import java.util.Set;

@Component
public class AuthorAwarePermissionEvaluator implements PermissionEvaluator {

    private Set<String> roles = Set.of(Role.ADMIN, Role.MODERATOR);

    @Override
    public boolean hasPermission(Authentication authentication, Object targetDomainObject, Object permission) {
        if (targetDomainObject == null) {
            return false;
        }

        User principal = (User) authentication.getPrincipal();


        if (targetDomainObject instanceof Blamable) {
            return handleBlamable(principal, (Blamable) targetDomainObject);
        }

        return false;
    }

    @Override
    public boolean hasPermission(Authentication authentication, Serializable targetId, String targetType, Object permission) {
        throw new UnsupportedOperationException("Not yet implemented.");
    }

    private boolean handleBlamable(User principal, Blamable blamable) {
        if (roles.contains(principal.getRole())) {
            return true;
        }

        User author = blamable.getCreatedBy();

        if (author == null) {
            return true;
        }

        return Objects.equals(principal, author);
    }

}