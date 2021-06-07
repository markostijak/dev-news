package com.stijaktech.devnews.domain.user.dto;

import com.stijaktech.devnews.domain.user.User;
import org.springframework.data.rest.core.config.Projection;

@Projection(name = "view", types = User.class)
public interface UserView {

    String getPicture();

    String getUsername();

    String getLastName();

    String getFirstName();

}
