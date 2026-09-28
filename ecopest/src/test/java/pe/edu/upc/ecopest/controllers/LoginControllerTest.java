package pe.edu.upc.ecopest.controllers;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;
import pe.edu.upc.ecopest.exceptions.GlobalExceptionHandler;

import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class LoginControllerTest {
    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        AuthenticationManager authenticationManager = authentication -> {
            throw new BadCredentialsException("Bad credentials");
        };
        LocalValidatorFactoryBean validator = new LocalValidatorFactoryBean();
        validator.afterPropertiesSet();
        mockMvc = MockMvcBuilders.standaloneSetup(
                        new LoginController(authenticationManager, null))
                .setControllerAdvice(new GlobalExceptionHandler())
                .setValidator(validator)
                .build();
    }

    @Test
    void rejectsBlankLoginFields() throws Exception {
        mockMvc.perform(post("/login")
                        .contentType(APPLICATION_JSON)
                        .content("""
                                {"username":" ","password":""}
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").value(
                        "username: The username is required; password: The password is required"))
                .andExpect(jsonPath("$.path").value("/login"));
    }

    @Test
    void returnsUnauthorizedForInvalidCredentials() throws Exception {
        mockMvc.perform(post("/login")
                        .contentType(APPLICATION_JSON)
                        .content("""
                                {"username":"adriano","password":"password123"}
                                """))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401))
                .andExpect(jsonPath("$.message").value("Invalid username or password"));
    }

    @Test
    void returnsStructuredBadRequestForMalformedJson() throws Exception {
        mockMvc.perform(post("/login")
                        .contentType(APPLICATION_JSON)
                        .content("{"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").value("Malformed or invalid request body"))
                .andExpect(jsonPath("$.path").value("/login"));
    }
}
