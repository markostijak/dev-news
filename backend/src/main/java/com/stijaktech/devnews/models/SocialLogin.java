package com.stijaktech.devnews.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SocialLogin {

    public enum Provider {
        FACEBOOK,
        GOOGLE,
        GITHUB;
    }

    private String code;
    private String token;
    private String email;
    private Provider provider;

}
