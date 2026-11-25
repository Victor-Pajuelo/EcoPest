package pe.edu.upc.ecopest.security;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.User;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

// Comprueba la matriz de permisos por rol de SecurityConfig (sin base de datos real)
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class SecurityRulesTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtTokenService tokens;

    private String bearer(String role) {
        return "Bearer " + tokens.generateToken(User.withUsername("demo").password("x").authorities(role).build());
    }

    private int status(MockHttpServletRequestBuilder request, String role) throws Exception {
        if (role != null) {
            request.header("Authorization", bearer(role));
        }
        return mockMvc.perform(request.contentType(MediaType.APPLICATION_JSON).content("{}"))
                .andReturn().getResponse().getStatus();
    }

    @Test
    void sinTokenLaApiRespondeNoAutorizado() throws Exception {
        assertEquals(401, status(get("/api/pest-types"), null));
        assertEquals(401, status(get("/api/business-entities"), null));
    }

    @Test
    void loginYSwaggerSonPublicos() throws Exception {
        assertNotEquals(401, status(post("/login"), null));
        assertEquals(200, status(get("/v3/api-docs"), null));
    }

    @Test
    void todosLosRolesLeen() throws Exception {
        for (String role : new String[]{"ROLE_ADMIN", "ROLE_SUPERVISOR", "ROLE_TESTER", "ROLE_CLIENTE"}) {
            int s = status(get("/api/pest-types"), role);
            assertNotEquals(401, s, role);
            assertNotEquals(403, s, role);
        }
    }

    @Test
    void soloAdminRegistraYEditaEmpresas() throws Exception {
        assertEquals(403, status(post("/api/business-entities"), "ROLE_SUPERVISOR"));
        assertEquals(403, status(put("/api/business-entities"), "ROLE_SUPERVISOR"));
        assertEquals(403, status(post("/api/business-entities"), "ROLE_TESTER"));
        assertEquals(403, status(put("/api/business-entities"), "ROLE_CLIENTE"));
        assertNotEquals(403, status(post("/api/business-entities"), "ROLE_ADMIN"));
        assertNotEquals(403, status(put("/api/business-entities"), "ROLE_ADMIN"));
    }

    @Test
    void supervisorRegistraYEditaPlagasPeroNoLasElimina() throws Exception {
        assertNotEquals(403, status(post("/api/pest-types"), "ROLE_SUPERVISOR"));
        assertNotEquals(403, status(put("/api/pest-types"), "ROLE_SUPERVISOR"));
        assertEquals(403, status(delete("/api/pest-types/1"), "ROLE_SUPERVISOR"));
        assertEquals(403, status(post("/api/pest-types"), "ROLE_TESTER"));
    }

    @Test
    void usuariosYRolesSoloAdmin() throws Exception {
        assertEquals(403, status(get("/api/users"), "ROLE_SUPERVISOR"));
        assertEquals(403, status(get("/api/roles"), "ROLE_TESTER"));
        assertNotEquals(403, status(get("/api/roles"), "ROLE_ADMIN"));
    }
}
