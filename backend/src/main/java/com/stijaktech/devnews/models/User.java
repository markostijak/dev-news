package com.stijaktech.devnews.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    private String id;
    private String email;
    private String picture;
    private String password;
    private String lastName;
    private String username;
    private String firstName;
    private Provider provider;

}
