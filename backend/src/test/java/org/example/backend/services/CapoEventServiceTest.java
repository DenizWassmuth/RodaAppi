package org.example.backend.services;

import org.example.backend.data.LocationData;
import org.example.backend.dto.CapoEventRegDto;
import org.example.backend.enums.CapoEventEnumType;
import org.example.backend.enums.RepetitionRhythmEnumType;
import org.example.backend.models.CapoEvent;
import org.example.backend.repositories.CapoEventRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;

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
            LocalDateTime.of(2026, 2, 15, 19, 0, 0, 0),
            LocalDateTime.of(2026, 2, 15, 23, 0, 0, 0),
            CapoEventEnumType.RODA,
            RepetitionRhythmEnumType.ONCE
    );

    CapoEventRegDto regDto = new CapoEventRegDto(
            "1",
            "chiko",
            "roda fechada",
            "angola",
            "www.somepicture.com",
            new LocationData("Germany", "Hamburg", "Hamburg", "Am Veringhof.", "23b", "Ende vom Parkplatz"),
            LocalDateTime.of(2026, 2, 14, 19, 0, 0, 0),
            LocalDateTime.of(2026, 2, 14, 23, 0, 0, 0),
            CapoEventEnumType.RODA,
            RepetitionRhythmEnumType.MONTHLY
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

        Mockito.when(capoEventRepo.findById("1")).thenReturn(Optional.of(fakeEvent1));

        boolean expected = capoEventService.deleteById("1", fakeEvent1.id());

        assertTrue(expected);
    }

    @Test
    void deleteById_shouldReturnFalse_whenEventDoesNotExist() {

        Mockito.when(capoEventRepo.findById("1")).thenReturn(Optional.empty());

        boolean actual = capoEventService.deleteById("1", "1");

        assertFalse(actual);
    }

    @Test
    void deleteById_shouldReturnFalse_whenWhenCreatorIdAndUserIdDoNotMatch() {

        Mockito.when(capoEventRepo.findById("1")).thenReturn(Optional.of(fakeEvent1));

        boolean actual = capoEventService.deleteById("1", "4");

        assertFalse(actual);
    }

    @Test
    void getAllByCreatorId_shouldReturnEmptyArrayList_whenIdIsNull() {

        List<CapoEvent> actualList = capoEventService.getAllByCreatorId(null);

        assertNotNull(actualList);
        assertEquals( 0, actualList.size());
    }

    @Test
    void getAllByCreatorId_shouldReturnExpectedList() {
        List<CapoEvent> expectedList = List.of(fakeEvent1);
        Mockito.when(capoEventRepo.findAllByCreatorId("1")).thenReturn(expectedList);
        List<CapoEvent> actualList = capoEventService.getAllByCreatorId("1");

        assertNotNull(actualList);
        assertEquals(expectedList, actualList);
    }

    @Test
    void createCapoEvent_shouldThrowIllegalArgumentException_whenDTOIsNull() {

        assertThrows(IllegalArgumentException.class, () -> capoEventService.createCapoEvent(null));
    }

    @Test
    void createCapoEvent_shouldReturnCapoEvent_basedOnRegDto() {

        Mockito.when(capoEventRepo.save(any())).thenReturn(fakeEvent1);

        CapoEventRegDto regDto = new CapoEventRegDto(
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

        CapoEvent actual = capoEventService.createCapoEvent(regDto);

        assertNotNull(actual);
        assertNotNull(actual.id());
        assertNotEquals(0, actual.id().length());
        assertEquals(regDto.userId(), actual.creatorId());
        assertEquals(regDto.eventTitle(), actual.eventTitle());
        assertEquals(regDto.eventDescription(), actual.eventDescription());
    }

    @Test
    void updateCapoEvent_shouldThrowIllegalArgumentException_whenUserIdIsnUll() {
        assertThrows(IllegalArgumentException.class, () -> capoEventService.updateCapoEvent(null, fakeEvent1.id(), regDto));
    }

    @Test
    void updateCapoEvent_shouldThrowIllegalArgumentException_whenEventIdIsNull() {
        assertThrows(IllegalArgumentException.class, () -> capoEventService.updateCapoEvent(fakeEvent1.creatorId(), null, regDto));
    }

    @Test
    void updateCapoEvent_shouldThrowIllegalArgumentException_whenDTOIsNull() {
        assertThrows(IllegalArgumentException.class, () -> capoEventService.updateCapoEvent(fakeEvent1.creatorId(), fakeEvent1.id(), null));
    }

    @Test
    void updateCapoEvent_shouldThrowIllegalArgumentException_whenNotFound() {
        assertThrows(NoSuchElementException.class, () -> capoEventService.updateCapoEvent("1","2", regDto));
    }

    @Test
    void updateCapoEvent_shouldThrowMatchException_whenCreatorIdAndUserIdDoNotMatch() {
        Mockito.when(capoEventRepo.findById("1")).thenReturn(Optional.of(fakeEvent1));
        assertThrows(MatchException.class, () -> capoEventService.updateCapoEvent("2","1", regDto));
    }

    @Test
    void updateCapoEvent_ShouldPass_andReturnTheUpdatedCapoEvent() {

        Mockito.when(capoEventRepo.findById("1")).thenReturn(Optional.of(fakeEvent1));

        CapoEvent expected = fakeEvent1
                .withEventTitle(regDto.eventTitle())
                .withEventDescription(regDto.eventDescription())
                .withEventStart(regDto.eventStart())
                .withEventEnd(regDto.eventEnd())
                .withLocationData(regDto.locationData())
                .withThumbnail(regDto.thumbnail())
                .withRepRhythm(regDto.repRhythm())
                .withEventType(regDto.eventType());

        Mockito.when(capoEventRepo.save(expected)).thenReturn(expected);

        CapoEvent actual = capoEventService.updateCapoEvent("1", "1", regDto);

        assertNotNull(actual);
        assertNotEquals(fakeEvent1, actual);
        assertEquals(expected.creatorId(), actual.creatorId());
        assertEquals(expected.id(), actual.id());
        assertEquals(expected.eventTitle(), actual.eventTitle());
        assertEquals(expected.eventDescription(), actual.eventDescription());
        assertEquals(expected.eventStart(), actual.eventStart());
        assertEquals(expected.eventEnd(), actual.eventEnd());
        assertEquals(expected.locationData(), actual.locationData());
        assertEquals(expected.thumbnail(), actual.thumbnail());
        assertEquals(expected.repRhythm(), actual.repRhythm());
        assertEquals(expected.eventType(), actual.eventType());
    }
}