package com.stijaktech.devnews.domain;

import com.stijaktech.devnews.domain.user.User;

public interface Blameable {

    User getCreatedBy();

    User getUpdatedBy();

}
