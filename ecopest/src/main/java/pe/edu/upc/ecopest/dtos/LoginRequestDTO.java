package pe.edu.upc.ecopest.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class LoginRequestDTO {
    @NotBlank(message = "The username is required")
    private String username;

    @NotBlank(message = "The password is required")
    @Size(min = 8, max = 100, message = "The password must be between 8 and 100 characters")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    public LoginRequestDTO() {
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}