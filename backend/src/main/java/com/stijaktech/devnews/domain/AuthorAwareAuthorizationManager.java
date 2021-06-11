package com.stijaktech.devnews.domain;

import com.stijaktech.devnews.domain.user.User;
import com.stijaktech.devnews.features.authentication.AuthenticatedUser;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.io.Serializable;
import java.lang.reflect.Field;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Function;
import java.util.function.Supplier;

import static org.springframework.data.util.ReflectionUtils.AnnotationFieldFilter;
import static org.springframework.data.util.ReflectionUtils.findField;
import static org.springframework.util.ReflectionUtils.getField;
import static org.springframework.util.ReflectionUtils.makeAccessible;

@Component("am")
public class AuthorAwareAuthorizationManager {

    private static final Map<Class<?>, Optional<Field>> TYPE_CACHE = new ConcurrentHashMap<>();
    private static final AnnotationFieldFilter CREATED_BY_FILTER = new AnnotationFieldFilter(CreatedBy.class);

    private final Supplier<Authentication> authenticationSupplier;

    public AuthorAwareAuthorizationManager(Supplier<Authentication> authenticationSupplier) {
        this.authenticationSupplier = authenticationSupplier;
    }

    protected boolean canWrite(AuthenticatedUser principal, Object model) {
        User createdBy = extractCreatedBy(model);
        return createdBy == null || isSameUser(principal, createdBy);
    }

    protected boolean canDelete(AuthenticatedUser principal, Object model) {
        return isSameUser(principal, extractCreatedBy(model));
    }

    protected boolean isAuthor(AuthenticatedUser principal, Object model) {
        if (model instanceof User user) {
            return isSameUser(principal, user);
        }

        User createdBy = extractCreatedBy(model);
        if (createdBy == null) {
            return true;
        }

        return isSameUser(principal, createdBy);
    }

    protected boolean hasPermission(AuthenticatedUser principal, Object model, String permission) {
        return principal.getRole().asString().equals(permission) ||
                principal.getPrivileges().stream().anyMatch(p -> p.asString().equals(permission));
    }


    // ------------------ Helper methods to be used in @PreAuthorized annotation ----------------------//

    public boolean isAuthor(Object model) {
        return isAuthenticatedAnd(principal -> isAuthor(principal, model));
    }

    public boolean canWrite(Object model) {
        return isAuthenticatedAnd(principal -> canWrite(principal, model));
    }

    public boolean canDelete(Object model) {
        return isAuthenticatedAnd(principal -> canDelete(principal, model));
    }

    public boolean hasPermission(Object model, String permission) {
        return isAuthenticatedAnd(principal -> hasPermission(principal, model, permission));
    }

    public boolean hasPermission(Authentication authentication, Object model, Object permission) {
        return isAuthenticatedAnd(principal -> hasPermission(principal, model, permission.toString()));
    }

    public boolean hasPermission(Authentication authentication, Serializable targetId, String targetType, Object permission) {
        throw new UnsupportedOperationException();
    }

    // ------------------ Private helper methods ----------------------//

    private boolean isAuthenticatedAnd(Function<AuthenticatedUser, Boolean> function) {
        Authentication authentication = authenticationSupplier.get();
        return authentication != null && authentication.isAuthenticated() &&
                authentication.getPrincipal() instanceof AuthenticatedUser p && function.apply(p);
    }

    private User extractCreatedBy(Object model) {
        return TYPE_CACHE.computeIfAbsent(model.getClass(), type -> {
            Field field = findField(type, CREATED_BY_FILTER);

            if (field != null) {
                makeAccessible(field);
            }

            return Optional.ofNullable(field);
        }).map(f -> (User) getField(f, model)).orElse(null);
    }

    private boolean isSameUser(AuthenticatedUser principal, User createdBy) {
        return Objects.equals(principal.getId(), createdBy == null ? null : createdBy.getId());
    }

}
