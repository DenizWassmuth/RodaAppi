package org.example.backend.controllers;

import org.example.backend.data.LocationData;
import org.example.backend.dto.CapoEventRegDto;
import org.example.backend.enums.CapoEventEnumType;
import org.example.backend.enums.EditScope;
import org.example.backend.enums.RepetitionRhythmEnumType;
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
            "1",
            0,
            "chiko",
            "roda aberta",
            "angola, regional, contemporanea",
            "www.somepicture.com",
            new LocationData("Germany", "Berlin", "Berlin", "Friedrichstr.", "244", "Hinterhof"),
            LocalDateTime.of(2026,2,15, 19, 0, 0, 0),
            LocalDateTime.of(2026,2,15, 23, 0, 0, 0),
            CapoEventEnumType.RODA,
            RepetitionRhythmEnumType.ONCE
    );

    CapoEvent fakeEvent2 = new CapoEvent(
            "2",
            "1",
            "1",
            1,
            "chiko",
            "roda aberta",
            "angola, regional, contemporanea",
            "www.somepicture.com",
            new LocationData("Germany", "Berlin", "Berlin", "Friedrichstr.", "244", "Hinterhof"),
            LocalDateTime.of(2026,2,15, 19, 0, 0, 0),
            LocalDateTime.of(2026,2,15, 23, 0, 0, 0),
            CapoEventEnumType.RODA,
            RepetitionRhythmEnumType.ONCE
    );

    CapoEventRegDto fakeRegDto = new CapoEventRegDto(
            "1",
            "piru",
            "roda fechada",
            "angola",
            "www.somepicture.com",
            new LocationData("Germany", "Hamburg", "Hamburg", "Am Veringhof.", "23b", "Ende vom Parkplatz"),
            LocalDateTime.of(2026,2,14, 19, 0, 0, 0),
            LocalDateTime.of(2026,2,14, 23, 0, 0, 0),
            CapoEventEnumType.RODA,
            RepetitionRhythmEnumType.ONCE,
            LocalDateTime.of(2026,2,14, 23, 0, 0, 0)
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
                .andExpect(MockMvcResultMatchers.jsonPath("$.locationData").isNotEmpty())
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
    void create_shouldReturnStatusIsCreated_andReturnMatchContent() throws Exception {

        mockMvc.perform(post("/api/capoevent")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "userId": "123456",
                                  "userName":"chiko",
                                  "eventTitle": "Roda Aberta",
                                  "eventDescription": "Angola + Regional. Bring water, beginners welcome.",
                                  "thumbnail": "https://example.com/images/roda.jpg",
                                  "locationData": {
                                    "country": "Germany",
                                    "state": "Hamburg",
                                    "city": "Hamburg",
                                    "street": "Am Veringhof",
                                    "streetnumber": "23b"
                                  },
                                  "eventStart": "2026-02-15T19:00:00",
                                  "eventEnd": "2026-02-15T23:00:00",
                                  "eventType": "RODA",
                                  "repRhythm": "ONCE",
                                  "repUntil": "2026-02-15T23:00:00"
                                }
                                
                                """)
                        .with(oauth2Login()))
                .andExpect(status().isCreated())
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").isNotEmpty())
                .andExpect(MockMvcResultMatchers.jsonPath("$.creatorId").value("123456"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.creatorName").value("chiko"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.eventTitle").value("Roda Aberta"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.eventDescription").value("Angola + Regional. Bring water, beginners welcome."))
                .andExpect(MockMvcResultMatchers.jsonPath("$.thumbnail").value("https://example.com/images/roda.jpg"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.locationData").isNotEmpty())
                .andExpect(MockMvcResultMatchers.jsonPath("$.eventType").value("RODA"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.repRhythm").value("ONCE"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.eventStart").value("2026-02-15T19:00:00"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.eventEnd").value("2026-02-15T23:00:00"));
    }

    @Test
    @WithMockUser
    void create_shouldReturnStatusBadRequest_whenBodyIsNull() throws Exception {

        mockMvc.perform(post("/api/capoevent")
                        .contentType(MediaType.APPLICATION_JSON)
                        .with(oauth2Login()))
                .andExpect(status().isBadRequest());

    }

    @Test
    @WithMockUser
    void create_shouldReturnStatusIsConflict_whenIdenticalEventExists() throws Exception {

        capoEventRepo.save(fakeEvent1);

        mockMvc.perform(post("/api/capoevent")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "userId": "1",
                                  "userName":"chiko",
                                  "eventTitle": "Roda Aberta",
                                  "eventDescription": "Angola + Regional. Bring water, beginners welcome.",
                                  "thumbnail": "https://example.com/images/roda.jpg",
                                  "locationData": {
                                    "country": "Germany",
                                    "state": "Berlin",
                                    "city": "Berlin",
                                    "street": "Friedrichstr.",
                                    "streetnumber": "244"
                                  },
                                  "eventStart": "2026-02-15T19:00:00",
                                  "eventEnd": "2026-02-15T23:00:00",
                                  "eventType": "RODA",
                                  "repRhythm": "ONCE",
                                  "repUntil": "2026-02-15T23:00:00"
                                }
                                
                                """)
                        .with(oauth2Login()))
                .andExpect(status().isConflict());
    }

    @Test
    @WithMockUser
    void create_shouldReturnStatusBadRequest_whenRepUntilIsBeforeStart() throws Exception {

        mockMvc.perform(post("/api/capoevent")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "userId": "1",
                                  "userName":"chiko",
                                  "eventTitle": "Roda Aberta",
                                  "eventDescription": "Angola + Regional. Bring water, beginners welcome.",
                                  "thumbnail": "https://example.com/images/roda.jpg",
                                  "locationData": {
                                    "country": "Germany",
                                    "state": "Berlin",
                                    "city": "Berlin",
                                    "street": "Friedrichstr.",
                                    "streetnumber": "244"
                                  },
                                  "eventStart": "2026-02-15T19:00:00",
                                  "eventEnd": "2026-02-15T23:00:00",
                                  "eventType": "RODA",
                                  "repRhythm": "DAILY",
                                  "repUntil": "2025-02-15T23:00:00"
                                }
                                
                                """)
                        .with(oauth2Login()))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser
    void update_shouldReturnStatusBadRequest_whenRequestBodyIsNull() throws Exception {

        mockMvc.perform(put("/api/capoevent/update/1/1")
                        .with(oauth2Login()))
                .andExpect(status().isBadRequest());
    }



    @Test
    @WithMockUser
    void update_shouldReturnStatusIsConflict_whenIdenticalEventExists() throws Exception {

        capoEventRepo.save(fakeEvent1);

        mockMvc.perform(put("/api/capoevent/update/1/2")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "userId": "1",
                                  "userName":"chiko",
                                  "eventTitle": "Roda Aberta",
                                  "eventDescription": "Angola + Regional. Bring water, beginners welcome.",
                                  "thumbnail": "https://example.com/images/roda.jpg",
                                  "locationData": {
                                    "country": "Germany",
                                    "state": "Berlin",
                                    "city": "Berlin",
                                    "street": "Friedrichstr.",
                                    "streetnumber": "244"
                                  },
                                  "eventStart": "2026-02-15T19:00:00",
                                  "eventEnd": "2026-02-15T23:00:00",
                                  "eventType": "RODA",
                                  "repRhythm": "ONCE"
                                }
                                
                                """)
                        .with(oauth2Login()))
                .andExpect(status().isConflict());
    }

    @Test
    @WithMockUser
    void update_shouldReturnStatusNotFound_whenEventDoesNotExist() throws Exception {

        mockMvc.perform(put("/api/capoevent/update/1/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "userId": "1",
                                  "userName":"chiko",
                                  "eventTitle": "Roda Aberta",
                                  "eventDescription": "Angola + Regional. Bring water, beginners welcome.",
                                  "thumbnail": "https://example.com/images/roda.jpg",
                                  "locationData": {
                                    "country": "Germany",
                                    "state": "Berlin",
                                    "city": "Berlin",
                                    "street": "Friedrichstr.",
                                    "streetnumber": "244"
                                  },
                                  "eventStart": "2026-02-15T19:00:00",
                                  "eventEnd": "2026-02-15T23:00:00",
                                  "eventType": "RODA",
                                  "repRhythm": "ONCE"
                                }
                                
                                """)
                        .with(oauth2Login()))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser
    void update_shouldReturnStatusOk_andMatchTheUpdateJson() throws Exception {

        capoEventRepo.save(fakeEvent1);

        mockMvc.perform(put("/api/capoevent/update/1/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "userId": "1",
                                  "userName": "chiko",
                                  "eventTitle": "Roda fechada",
                                  "eventDescription": "Angola",
                                  "thumbnail": "https://example.com/images/roda.jpg",
                                  "locationData": {
                                    "country": "Germany",
                                    "state": "Hamburg",
                                    "city": "Hamburg",
                                    "street": "Am Veringhof",
                                    "streetnumber": "23b"
                                  },
                                  "eventStart": "2026-02-14T19:00:00",
                                  "eventEnd": "2026-02-14T23:00:00",
                                  "eventType": "RODA",
                                  "repRhythm": "ONCE"
                                }
                                
                                """)
                        .with(oauth2Login()))
                .andExpect(status().isCreated())
                .andExpect(MockMvcResultMatchers.jsonPath("$.creatorId").value("1"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.creatorName").value("chiko"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.eventTitle").value("Roda fechada"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.eventDescription").value("Angola"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.thumbnail").value("https://example.com/images/roda.jpg"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.locationData").isNotEmpty())
                .andExpect(MockMvcResultMatchers.jsonPath("$.eventType").value("RODA"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.repRhythm").value("ONCE"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.eventStart").value("2026-02-14T19:00:00"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.eventEnd").value("2026-02-14T23:00:00"));
    }

    @Test
    @WithMockUser
    void deleteById_shouldReturnStatusNotFound_2_1() throws Exception {

        capoEventRepo.save(fakeEvent1); // has creatorId 1

        mockMvc.perform(delete("/api/capoevent/delete/2/1")
                        .with(oauth2Login()))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser
    void deleteById_shouldReturnStatusNotFound_1_2() throws Exception {

        capoEventRepo.save(fakeEvent1); // has id 1

        mockMvc.perform(delete("/api/capoevent/delete/1/2")
                        .with(oauth2Login()))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser
    void deleteById_shouldReturnBadRequest() throws Exception {

        capoEventRepo.save(fakeEvent1); // has id 1

        mockMvc.perform(delete("/api/capoevent/delete/1/1")
                        .param("deleteScope", "NO_REAL_SCOPE")
                        .with(oauth2Login()))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser
    void deleteById_shouldReturnStatusNoContent_whenScopeIs_Only_This() throws Exception {

        capoEventRepo.save(fakeEvent1);

        mockMvc.perform(delete("/api/capoevent/delete/1/1")
                        .param("deleteScope", "ONLY_THIS")
                        .with(oauth2Login()))
                .andExpect(status().isNoContent());
    }

    @Test
    @WithMockUser
    void deleteById_shouldReturnIsNoContent_whenScopeIs_All_IN_SERIES() throws Exception {

        capoEventRepo.save(fakeEvent1); // has id 1

        mockMvc.perform(delete("/api/capoevent/delete/1/1")
                        .param("deleteScope", EditScope.ALL_IN_SERIES.toString())
                        .with(oauth2Login()))
                .andExpect(status().isNoContent());
    }

    @Test
    @WithMockUser
    void deleteById_shouldReturnIsNoContent_whenScopeIs_AFTER_THIS() throws Exception {

        capoEventRepo.save(fakeEvent1); // has id 1

        mockMvc.perform(delete("/api/capoevent/delete/1/1")
                        .param("deleteScope", EditScope.AFTER_THIS.toString())
                        .with(oauth2Login()))
                .andExpect(status().isNoContent());
    }

    @Test
    @WithMockUser
    void deleteById_shouldReturnIsNoContent_whenScopeIs_BEFORE_THIS() throws Exception {

        capoEventRepo.save(fakeEvent1); // has id 1

        mockMvc.perform(delete("/api/capoevent/delete/1/1")
                        .param("deleteScope", EditScope.BEFORE_THIS.toString())
                        .with(oauth2Login()))
                .andExpect(status().isNoContent());
    }

    @Test
    @WithMockUser
    void getPartOfSeries_returnsStatusIsBadRequest_whenOccurrenceIndexIsNegativeValue() throws Exception {

        mockMvc.perform(get("/api/capoevent/1/1/-1")
                        .with(oauth2Login()))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser
    void getPartOfSeries_returnsStatusIsOk() throws Exception {

        capoEventRepo.save(fakeEvent1);
        capoEventRepo.save(fakeEvent2);

        mockMvc.perform(get("/api/capoevent/1/1/1")
                        .with(oauth2Login()))
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.isPartOfSeries").value(true))
                .andExpect(MockMvcResultMatchers.jsonPath("$.hasBefore").value(true))
                .andExpect(MockMvcResultMatchers.jsonPath("$.hasAfter").value(false));
    }
}