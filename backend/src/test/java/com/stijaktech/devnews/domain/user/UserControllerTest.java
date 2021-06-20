package com.stijaktech.devnews.domain.user;

import com.stijaktech.devnews.domain.Status;
import org.hamcrest.core.IsIterableContaining;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import javax.mail.Session;
import javax.mail.internet.MimeMessage;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.collection.IsCollectionWithSize.hasSize;
import static org.hamcrest.core.Is.is;
import static org.hamcrest.core.IsIterableContaining.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.contains;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class UserControllerTest {

    private @Autowired MockMvc mvc;
    private @Autowired UserRepository userRepository;
    private @MockBean PasswordEncoder passwordEncoder;
    private @MockBean JavaMailSender javaMailSender;

    @BeforeEach
    void setUp() {
        when(passwordEncoder.encode(anyString())).thenReturn("encoded");
        when(javaMailSender.createMimeMessage()).thenReturn(new MimeMessage((Session) null));
    }

    @Test
    void givenInvalidJson_WhenCreate_ThenReturnBadRequest() throws Exception {
        //language=json
        String json = """ 
            {
                "email": "john.murphy@app.com",
                "firstName":"John",
                "lastName":"Murphy"
             }
        """;

        mvc.perform(post("/api/v1/users")
                .content(json).contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error.status", is("Bad Request")))
                .andExpect(jsonPath("$.error.message")
                        .value(hasItem("password must not be blank")))
                .andExpect(jsonPath("$.error.message")
                        .value(hasItem("username must not be blank")))
                .andExpect(jsonPath("$.error.code", is(400)));
    }

    @Test
    void givenValidJson_WhenCreate_ThenReturnSuccess() throws Exception {
        //language=json
        String json = """ 
            {
                "email": "john.murphy@app.com",
                "username":"john.murphy",
                "password":"6sytL7Xi5PvAGH9",
                "firstName":"John",
                "lastName":"Murphy"
             }
        """;

        // assert response
        mvc.perform(post("/api/v1/users")
                .content(json)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.password").doesNotExist())
                .andExpect(jsonPath("$.firstName", is("John")))
                .andExpect(jsonPath("$.lastName", is("Murphy")))
                .andExpect(jsonPath("$.username", is("john.murphy")))
                .andExpect(jsonPath("$.email", is("john.murphy@app.com")))
                .andExpect(jsonPath("$.status", is("AWAITING_ACTIVATION")))
                .andExpect(jsonPath("$.privileges").isArray())
                .andExpect(jsonPath("$.privileges", hasSize(1)))
                .andExpect(jsonPath("$.privileges[0]", is("READ")))
                .andExpect(jsonPath("$.role", is("USER")))
                .andExpect(jsonPath("$._links.activate.href").exists())
                .andExpect(jsonPath("$._links.resendActivationCode.href").exists());

        // assert database record
        User user = userRepository.findByUsername("john.murphy").orElseThrow();
        assertThat(user.getId()).isNotNull();
        assertThat(user.getFirstName()).isEqualTo("John");
        assertThat(user.getLastName()).isEqualTo("Murphy");
        assertThat(user.getEmail()).isEqualTo("john.murphy@app.com");
        assertThat(user.getPassword()).isEqualTo("encoded");
        assertThat(user.getActivationCode()).isNotNull();
        assertThat(user.getRole()).isEqualTo(Role.USER);
        assertThat(user.getPrivileges()).containsOnly(Privilege.READ);
        assertThat(user.getStatus()).isEqualTo(Status.AWAITING_ACTIVATION);
        assertThat(user.getProvider()).isEqualTo(Provider.LOCAL);

        verify(javaMailSender, times(1)).send(any(MimeMessage.class));
    }

}
