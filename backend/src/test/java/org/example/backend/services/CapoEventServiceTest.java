package org.example.backend.services;

import org.example.backend.enums.CapoEventType;
import org.example.backend.enums.RepetitionRhythm;
import org.example.backend.models.CapoEvent;
import org.example.backend.repositories.CapoEventRepository;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class CapoEventServiceTest {

CapoEventRepository capoEventRepo = Mockito.mock(CapoEventRepository.class);
CapoEventService capoEventService = new CapoEventService(capoEventRepo);

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
    void getAll_shouldReturnEmptyList_whenNoEventFound() {
        // GIVEN
        Mockito.when(capoEventRepo.findAll()).thenReturn(List.of());

        //WHEN
        List<CapoEvent> actualList = capoEventService.getAll();

        //THEN

        assertNotNull(actualList);
        assertEquals( 0, actualList.size());
    }
    @Test
    void getAll_shouldReturnExpectedList() {
        // GIVEN
        List<CapoEvent> expectedList = List.of(fakeEvent1);
        Mockito.when(capoEventRepo.findAll()).thenReturn(expectedList);

        //WHEN
        List<CapoEvent> actualList = capoEventService.getAll();

        //THEN

        assertNotNull(actualList);
        assertEquals(expectedList, actualList);
    }
}