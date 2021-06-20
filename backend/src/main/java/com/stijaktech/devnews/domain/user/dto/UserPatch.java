package com.stijaktech.devnews.domain.user.dto;

import lombok.Data;
import org.springframework.lang.Nullable;

import javax.validation.constraints.Size;

@Data
public class UserPatch {

    @Nullable
    @Size(min = 5, max = 64)
    private String username;

    @Nullable
    @Size(min = 1, max = 64)
    private String firstName;

    @Nullable
    @Size(min = 1, max = 64)
    private String lastName;

    @Nullable
    private String picture;

}
