package com.stijaktech.devnews.domain.user.projections;

import com.stijaktech.devnews.domain.user.User;
import org.springframework.data.rest.core.config.Projection;

@Projection(name = "preview", types = User.class)
public interface UserPreview {

    String getId();

    String getUsername();

    String getFirstName();

    String getLastName();

    String getPicture();

}
