package org.example.backend.services;

import org.example.backend.data.LocationData;
import org.example.backend.enums.CapoEventEnumType;
import org.example.backend.enums.RepetitionRhythmEnumType;
import org.example.backend.models.CapoEvent;
import org.example.backend.repositories.CapoEventRepository;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

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
        new LocationData("Germany", "Berlin", "Berlin", "Friedrichstr.", "244", "Hinterhof"),
        LocalDateTime.of(2026,2,15, 19, 0, 0, 0),
        LocalDateTime.of(2026,2,15, 23, 0, 0, 0),
        CapoEventEnumType.RODA,
        RepetitionRhythmEnumType.ONCE
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

    @Test
    void getById_shouldReturnExpectedCapoEvent() {

        Mockito.when(capoEventRepo.findById("1")).thenReturn(Optional.of(fakeEvent1));

        CapoEvent actualCapoEvent = capoEventService.getById("1");

        assertNotNull(actualCapoEvent);
        assertEquals(fakeEvent1, actualCapoEvent);
    }

    @Test
    void getById_shouldReturnNull_whenNoEventFound() {

        Mockito.when(capoEventRepo.findById("1")).thenReturn(Optional.empty());

        CapoEvent actualCapoEvent = capoEventService.getById("1");

        assertNull(actualCapoEvent);
    }

    @Test
    void deleteById_shouldReturnTrue_whenEventIsDeleted() {

        Mockito.when(capoEventRepo.existsById("1")).thenReturn(true);

        boolean expected = capoEventService.deleteById("1");

        assertTrue(expected);
    }

    @Test
    void deleteById_shouldReturnFalse_whenEventDoesNotExist() {

        Mockito.when(capoEventRepo.existsById("1")).thenReturn(false);

        boolean expected = capoEventService.deleteById("1");

        assertFalse(expected);
    }
}