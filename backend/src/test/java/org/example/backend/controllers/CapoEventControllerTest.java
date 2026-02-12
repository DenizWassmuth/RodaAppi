package org.example.backend.controllers;

import org.example.backend.data.LocationData;
import org.example.backend.enums.CapoEventType;
import org.example.backend.enums.RepetitionRhythm;
import org.example.backend.models.CapoEvent;
import org.example.backend.repositories.CapoEventRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultMatcher;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.time.LocalDateTime;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.oauth2Login;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class CapoEventControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private CapoEventRepository capoEventRepo;

    @BeforeEach
    void cleanDb() {capoEventRepo.deleteAll();}

    CapoEvent fakeEvent1 = new CapoEvent(
            "1",
            "1",
            "chiko",
            "roda aberta",
            "angola, regional, contemporanea",
            "www.somepicture.com",
            new LocationData("Germany", "Berlin", "Berlin", "Friedrichstr.", "244", "Hinterhof"),
            LocalDateTime.of(2026,2,15, 19, 0, 0, 0),
            LocalDateTime.of(2026,2,15, 23, 0, 0, 0),
            CapoEventType.RODA,
            RepetitionRhythm.ONCE
    );

    @Test
    @WithMockUser
    void getAll_shouldReturnAllCapoEvents_ifRepoHasAny() throws Exception {

        // GIVEN
        capoEventRepo.save(fakeEvent1);

        ResultMatcher jsonMatch = MockMvcResultMatchers.content().json(
                """
                        [
                          {
                            "id": "1",
                            "creatorId": "1",
                            "creatorName": "chiko",
                            "eventTitle": "roda aberta",
                            "eventDescription": "angola, regional, contemporanea",
                            "thumbnail": "www.somepicture.com",
                            "locationData":
                              {
                                "country": "Germany",
                                "state": "Berlin",
                                "city": "Berlin",
                                "street": "Friedrichstr.",
                                "streetNumber": "244",
                                "specifics":"Hinterhof"
                              },
                            "eventStart": "2026-02-15T19:00:00",
                            "eventEnd": "2026-02-15T23:00:00",
                            "eventType": "RODA",
                            "repRhythm": "ONCE"
                          }
                        ]
                        """);

        //WHEN
        mockMvc.perform(get("/api/capoevent"))
                //THEN
                .andExpect(status().isOk())
                .andExpect(jsonMatch);
    }

    @Test
    @WithMockUser
    void getById_shouldReturnStatusOk_andSavedEvent() throws Exception {

        // GIVEN
        capoEventRepo.save(fakeEvent1);

        //WHEN
        mockMvc.perform(get("/api/capoevent/1"))
                //THEN
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").value("1"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.creatorId").value("1"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.creatorName").value("chiko"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.eventTitle").value("roda aberta"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.eventDescription").value("angola, regional, contemporanea"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.thumbnail").value("www.somepicture.com"))
                //.andExpect(MockMvcResultMatchers.jsonPath("$.locationData").value("Germany", "Berlin", "Berlin", "Friedrichstr.", "244", "Hinterhof"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.eventStart").value("2026-02-15T19:00:00"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.eventEnd").value("2026-02-15T23:00:00"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.eventType").value("RODA"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.repRhythm").value("ONCE"));
    }

    @Test
    @WithMockUser
    void getById_shouldReturnStatusNotFound() throws Exception {

        // GIVEN
        capoEventRepo.save(fakeEvent1); // has id 1

        //WHEN
        mockMvc.perform(get("/api/capoevent/2"))
                //THEN
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser
    void deleteById_shouldReturnStatusNoContent() throws Exception {
        capoEventRepo.save(fakeEvent1);

        mockMvc.perform(delete("/api/capoevent/1")
                        .with(oauth2Login()))
                .andExpect(status().isNoContent());
    }

    @Test
    @WithMockUser
    void deleteById_shouldReturnStatusNotFound() throws Exception {

        capoEventRepo.save(fakeEvent1); // has id 1

        mockMvc.perform(delete("/api/capoevent/2")
                        .with(oauth2Login()))
                .andExpect(status().isNotFound());
    }
}