package com.stijaktech.devnews.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    private String email;
    @JsonIgnore
    private String password;
    private String lastName;
    private String firstName;
    private String username;

}
