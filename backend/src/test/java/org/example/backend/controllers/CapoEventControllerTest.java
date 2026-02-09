package org.example.backend.controllers;

import org.example.backend.enums.CapoEventType;
import org.example.backend.enums.RepetitionRhythm;
import org.example.backend.models.CapoEvent;
import org.example.backend.repositories.CapoEventRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultMatcher;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.time.LocalDateTime;

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
            "Berlin",
            "friedrichstr. 20",
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
         "eventId": "1",
         "creatorId": "1",
         "creatorName": "chiko",
         "eventTitle": "roda aberta",
         "eventDescription": "angola, regional, contemporanea",
         "thumbnail": "www.somepicture.com",
         "eventLocation": "Berlin",
         "street": "friedrichstr. 20",
         "eventStart": "2026-02-15T19:00:00",
         "eventEnd": "2026-02-15T23:00:00",
         "eventType": "RODA",
         "repRhythm": "ONCE"
       }
     ]
     """);

        //WHEN
        mockMvc.perform(MockMvcRequestBuilders.get("/api/capoevent"))
                //THEN
                .andExpect(status().isOk())
                .andExpect(jsonMatch);
    }
}