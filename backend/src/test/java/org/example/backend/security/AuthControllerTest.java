package org.example.backend.security;

import org.example.backend.models.AppUser;
import org.example.backend.repositories.AppUserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.util.List;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.oidcLogin;

@SpringBootTest()
@AutoConfigureMockMvc
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private AppUserRepository appUserRepository;

    @BeforeEach
    void cleanDb() {appUserRepository.deleteAll();}

    AppUser testUser1 = new AppUser("1", "chiko", List.of("2"), List.of("3"));

    private final String appUserJSON = """
            {
            "id":"1",
            "username": "chiko",
            "createdIds": ["2"],
            "bookmarkedIds": ["3"]
            }
            """;

    @Test
    void getMe() throws Exception{

        appUserRepository.save(testUser1);

        mockMvc.perform(MockMvcRequestBuilders.get("/api/auth")
                        .with(oidcLogin().userInfoToken(token -> token
                                .claim("id", testUser1.id()))))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().json(appUserJSON));
    }
}