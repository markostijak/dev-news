package com.stijaktech.devnews.domain.user.projections;

import com.stijaktech.devnews.domain.user.User;
import org.springframework.data.rest.core.config.Projection;

@Projection(name = "user", types = User.class)
public interface UserProjection {

    String getId();

    String getRole();

    String getStatus();

    String getPicture();

    String getLastName();

    String getUsername();

    String getProvider();

    String getFirstName();

}
