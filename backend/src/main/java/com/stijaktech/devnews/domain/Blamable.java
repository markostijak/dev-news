package com.stijaktech.devnews.domain;

import com.stijaktech.devnews.domain.user.User;

public interface Blamable {

    User getCreatedBy();

    User getUpdatedBy();

}
