package org.example.backend.security;

import org.example.backend.models.AppUser;
import org.example.backend.repositories.AppUserRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.util.Assert;

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

    @Test
    void getMe_respondsWithBadRequest_whenUserIsnull() throws Exception{

        MvcResult result= mockMvc.perform(MockMvcRequestBuilders.get("/api/auth"))
                .andExpect(MockMvcResultMatchers.status().isBadRequest())
                .andReturn();

        Assertions.assertNotNull(result);

    }

    @Test
    void getMe_respondsWithBadRequest_whenIdIsNull() throws Exception{

        MvcResult result= mockMvc.perform(MockMvcRequestBuilders.get("/api/auth")
                .with(oidcLogin().userInfoToken(token -> token
                        .claim("id", null))))
                .andExpect(MockMvcResultMatchers.status().isBadRequest())
                .andReturn();

        Assertions.assertNotNull(result);
    }

    @Test
    void getMe_respondsWithNotFound_whenUserWithGivenIdIsNotInRepo() throws Exception{

        appUserRepository.save(testUser1);

        MvcResult result= mockMvc.perform(MockMvcRequestBuilders.get("/api/auth")
                        .with(oidcLogin().userInfoToken(token -> token
                                .claim("id", "2"))))
                .andExpect(MockMvcResultMatchers.status().isNotFound())
                .andReturn();

        Assertions.assertNotNull(result);
    }
}