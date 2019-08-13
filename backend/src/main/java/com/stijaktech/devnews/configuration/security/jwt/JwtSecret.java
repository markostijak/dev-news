package com.stijaktech.devnews.configuration.security.jwt;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document("jwt-secrets")
public class JwtSecret {

    @Id
    private String id;

    /**
     * Base64 encoded secret key
     */
    private String value;

}
