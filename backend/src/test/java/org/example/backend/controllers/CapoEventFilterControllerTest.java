package org.example.backend.controllers;

import org.example.backend.data.LocationData;
import org.example.backend.enums.CapoEventEnumType;
import org.example.backend.enums.RepetitionRhythmEnumType;
import org.example.backend.models.CapoEvent;
import org.example.backend.repositories.CapoEventRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class CapoEventFilterControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private CapoEventRepository capoEventRepo;

    private final CapoEvent e1 = new CapoEvent(
            "1",
            "u1",
            "s1",
            0,
            "chiko",
            "Roda Hamburg",
            "Desc",
            "thumb",
            new LocationData("Germany", "Hamburg", "Hamburg", "Street", "1", ""),
            LocalDateTime.of(2026, 3, 10, 19, 0),
            LocalDateTime.of(2026, 3, 10, 21, 0),
            CapoEventEnumType.RODA,
            RepetitionRhythmEnumType.ONCE
    );

    private final CapoEvent e2 = new CapoEvent(
            "2",
            "u2",
            "s2",
            0,
            "alice",
            "Workshop Berlin",
            "Desc",
            "thumb",
            new LocationData("Germany", "Berlin", "Berlin", "Street", "2", ""),
            LocalDateTime.of(2026, 2, 5, 18, 0),
            LocalDateTime.of(2026, 2, 5, 20, 0),
            CapoEventEnumType.WORKSHOP,
            RepetitionRhythmEnumType.ONCE
    );

    private final CapoEvent e3 = new CapoEvent(
            "3",
            "u3",
            "s3",
            0,
            "bob",
            "Roda Miami",
            "Desc",
            "thumb",
            new LocationData("USA", "Florida", "Miami", "Street", "3", ""),
            LocalDateTime.of(2026, 4, 1, 19, 0),
            LocalDateTime.of(2026, 4, 1, 21, 0),
            CapoEventEnumType.RODA,
            RepetitionRhythmEnumType.ONCE
    );

    @BeforeEach
    void beforeEach() {
        capoEventRepo.saveAll(List.of(e1, e2, e3));
    }

    @AfterEach
    void afterEach() {
        capoEventRepo.deleteAll();
    }

    @Test
    void search_shouldReturnAll_whenNoFiltersProvided() throws Exception {
        mockMvc.perform(post("/api/capoevent/filters/search")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "country": null,
                                  "state": null,
                                  "city": null,
                                  "eventType": null,
                                  "startsAfter": null,
                                  "startsBefore": null,
                                  "upcomingOnly": false
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(3));
    }

    @Test
    void search_shouldFilterByCountryStateCity_andEventType() throws Exception {
        mockMvc.perform(post("/api/capoevent/filters/search")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "country": "Germany",
                                  "state": "Hamburg",
                                  "city": "Hamburg",
                                  "eventType": "RODA",
                                  "startsAfter": null,
                                  "startsBefore": null,
                                  "upcomingOnly": false
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].id").value("1"))
                .andExpect(jsonPath("$[0].locationData.city").value("Hamburg"))
                .andExpect(jsonPath("$[0].eventType").value("RODA"));
    }

    @Test
    void search_shouldFilterByStartsAfter_andStartsBefore() throws Exception {
        mockMvc.perform(post("/api/capoevent/filters/search")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "country": null,
                                  "state": null,
                                  "city": null,
                                  "eventType": null,
                                  "startsAfter": "2026-03-01T00:00:00",
                                  "startsBefore": "2026-03-31T23:59:59",
                                  "upcomingOnly": false
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].id").value("1"));
    }

    @Test
    void search_shouldReturnBadRequest_whenStartsBeforeIsBeforeStartsAfter() throws Exception {
        mockMvc.perform(post("/api/capoevent/filters/search")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "country": null,
                                  "state": null,
                                  "city": null,
                                  "eventType": null,
                                  "startsAfter": "2026-03-10T00:00:00",
                                  "startsBefore": "2026-03-01T00:00:00",
                                  "upcomingOnly": false
                                }
                                """))
                .andExpect(status().isBadRequest());
    }

    @Test
    void search_upcomingOnly_shouldNotOverrideStartsAfter_ifStartsAfterIsInFuture() throws Exception {
        mockMvc.perform(post("/api/capoevent/filters/search")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "country": null,
                                  "state": null,
                                  "city": null,
                                  "eventType": null,
                                  "startsAfter": "2099-01-01T00:00:00",
                                  "startsBefore": null,
                                  "upcomingOnly": false
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(content().json("[]"));
    }
}