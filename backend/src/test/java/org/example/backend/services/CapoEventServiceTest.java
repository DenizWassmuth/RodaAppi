package org.example.backend.services;

import org.example.backend.data.LocationData;
import org.example.backend.dto.CapoEventRegDto;
import org.example.backend.dto.PartOfSeriesDto;
import org.example.backend.enums.CapoEventEnumType;
import org.example.backend.enums.DeleteScope;
import org.example.backend.enums.RepetitionRhythmEnumType;
import org.example.backend.models.CapoEvent;
import org.example.backend.repositories.CapoEventRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EnumSource;
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
            "1",
            0,
            "chiko",
            "roda aberta",
            "angola, regional, comtemporanea",
            "www.somepicture.com",
            new LocationData("Germany", "Berlin", "Berlin", "Friedrichstr.", "244", "Hinterhof"),
            LocalDateTime.of(2026, 2, 15, 19, 0, 0, 0),
            LocalDateTime.of(2026, 2, 15, 23, 0, 0, 0),
            CapoEventEnumType.RODA,
            RepetitionRhythmEnumType.ONCE
    );

    CapoEventRegDto regDuplicateDto = new CapoEventRegDto(
            "1",
            "chiko",
            "roda aberta",
            "angola, regional, comtemporanea",
            "www.somepicture.com",
            new LocationData("Germany", "Berlin", "Berlin", "Friedrichstr.", "244", "Hinterhof"),
            LocalDateTime.of(2026,2,15, 19, 0, 0, 0),
            LocalDateTime.of(2026,2,15, 23, 0, 0, 0),
            CapoEventEnumType.RODA,
            RepetitionRhythmEnumType.ONCE,
            LocalDateTime.of(2026,2,15, 23, 0, 0, 0)
    );

    CapoEventRegDto regDto = new CapoEventRegDto(
            "1",
            "chiko",
            "roda aberta",
            "angola",
            "www.somepicture.com",
            new LocationData("Germany", "Hamburg", "Hamburg", "Am Veringhof.", "23b", "Ende vom Parkplatz"),
            LocalDateTime.of(2026, 2, 14, 19, 0, 0, 0),
            LocalDateTime.of(2026, 2, 14, 23, 0, 0, 0),
            CapoEventEnumType.RODA,
            RepetitionRhythmEnumType.MONTHLY,
            LocalDateTime.of(2027, 2, 14, 19, 0, 0, 0)
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
    void createCapoEvent_shouldThrowIllegalArgumentException_whenRepUntilIsBeforeStartDate() {

        CapoEventRegDto withedRegDto = regDto
                .withRepRhythm(RepetitionRhythmEnumType.DAILY)
                .withRepUntil(LocalDateTime.of(2022, 2, 14, 19, 0, 0, 0));

        assertThrows(IllegalArgumentException.class, () -> capoEventService.createCapoEvent(withedRegDto));
    }

    @Test
    void createCapoEvent_shouldThrowMatchException_whenEventAlreadyExists() {

        Mockito.when(capoEventRepo
                        .existsByIdNotAndEventStartAndLocationDataCountryAndLocationDataStateAndLocationDataCityAndLocationDataStreet(
                                null,
                                regDuplicateDto.eventStart(),
                                regDuplicateDto.locationData().country(),
                                regDuplicateDto.locationData().state(),
                                regDuplicateDto.locationData().city(),
                                regDuplicateDto.locationData().street()))
                .thenReturn(true);

        assertThrows(MatchException.class, () -> capoEventService.createCapoEvent(regDuplicateDto));
    }

    @Test
    void createCapoEvent_shouldReturnCapoEvent_basedOnRegDto() {

        Mockito.when(capoEventRepo.save(any())).thenReturn(fakeEvent1);

        CapoEventRegDto regEventDto = new CapoEventRegDto(
                "1",
                "chiko",
                "roda fechada",
                "angola",
                "www.somepicture.com",
                new LocationData("Germany", "Berlin", "Berlin", "Friedrichstr.", "244", "Hinterhof"),
                LocalDateTime.of(2026,2,15, 19, 0, 0, 0),
                LocalDateTime.of(2026,2,15, 23, 0, 0, 0),
                CapoEventEnumType.RODA,
                RepetitionRhythmEnumType.ONCE,
                LocalDateTime.of(2026,2,15, 23, 0, 0, 0)
        );

        CapoEvent actual = capoEventService.createCapoEvent(regEventDto);

        assertNotNull(actual);
        assertNotNull(actual.id());
        assertNotEquals(0, actual.id().length());
        assertEquals(regEventDto.userId(), actual.creatorId());
        assertEquals(regEventDto.eventTitle(), actual.eventTitle());
        assertEquals(regEventDto.eventDescription(), actual.eventDescription());
    }

    @ParameterizedTest
    @EnumSource(value = RepetitionRhythmEnumType.class, names = {"DAILY", "WEEKLY", "MONTHLY", "QUARTERLY", "YEARLY"})
    void shiftLocalDateTime_shouldShiftCorrectly_forSupportedRhythms(RepetitionRhythmEnumType rhythm) {

        LocalDateTime start = LocalDateTime.of(2026, 2, 15, 19, 0);

        LocalDateTime expected = switch (rhythm) {
            case DAILY -> start.plusDays(1);
            case WEEKLY -> start.plusWeeks(1);
            case MONTHLY -> start.plusMonths(1);
            case QUARTERLY -> start.plusMonths(3);
            case YEARLY -> start.plusYears(1);
            default -> throw new IllegalStateException("test enum set is wrong");
        };

        LocalDateTime actual = capoEventService.shiftLocalDateTime(start, rhythm);

        assertEquals(expected, actual);
    }

    @Test
    void shiftLocalDateTime_shouldReturnSameValue_forOnce() {

        LocalDateTime start = LocalDateTime.of(2026, 2, 15, 19, 0);

        LocalDateTime actual = capoEventService.shiftLocalDateTime(start, RepetitionRhythmEnumType.ONCE);

        assertEquals(start, actual);
    }

    @Test
    void shiftLocalDateTime_shouldThrowIllegalArgumentException_forCustom() { // We test the CUSTOM case.

        LocalDateTime start = LocalDateTime.of(2026, 2, 15, 19, 0);

        assertThrows(IllegalArgumentException.class, () -> capoEventService.shiftLocalDateTime(start, RepetitionRhythmEnumType.CUSTOM));
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
        Mockito.when(capoEventRepo.findById("1")).thenReturn(Optional.of(fakeEvent1)); // user id is 1
        assertThrows(NoSuchElementException.class, () -> capoEventService.updateCapoEvent("2","1", regDto));
    }

    @Test
    void updateCapoEvent_ShouldPass_andReturnTheUpdatedCapoEvent() {

        Mockito.when(capoEventRepo.findByIdAndCreatorId("1", "1")).thenReturn(Optional.of(fakeEvent1));

        CapoEvent expected = fakeEvent1
                .withEventTitle(regDto.eventTitle())
                .withEventDescription(regDto.eventDescription())
                .withEventStart(regDto.eventStart())
                .withEventEnd(regDto.eventEnd())
                .withLocationData(regDto.locationData())
                .withThumbnail(regDto.thumbnail());

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


    @Test
    void deleteById_shouldThrowNoSuchElementException_whenWhenCreatorIdAndUserIdDoNotMatch() {
        Mockito.when(capoEventRepo.findByIdAndCreatorId("1", "1")).thenReturn(Optional.of(fakeEvent1));

        assertThrows(NoSuchElementException.class, () -> capoEventService.deleteById("2","1",  DeleteScope.ONLY_THIS));
    }

    @Test
    void deleteById_shouldThrowIllegalArgumentException_deleteScopeIsNotElementOfEnum() {
        Mockito.when(capoEventRepo.findByIdAndCreatorId("1", "1")).thenReturn(Optional.of(fakeEvent1));

        assertThrows(IllegalArgumentException.class, () -> capoEventService.deleteById("1","1",  DeleteScope.valueOf("NO_REAL_SCOPE")));
    }

    @Test
    void deleteById_shouldReturnTrue_whenEventIsDeleted_ONLY_THIS() {
        Mockito.when(capoEventRepo.findByIdAndCreatorId("1", "1")).thenReturn(Optional.of(fakeEvent1));

        boolean expected = capoEventService.deleteById("1", fakeEvent1.id(), DeleteScope.ONLY_THIS);

        assertTrue(expected);
    }

    @Test
    void deleteById_shouldReturnTrue_whenEventIsDeleted_ALL_IN_SERIES() {
        Mockito.when(capoEventRepo.findByIdAndCreatorId("1", "1")).thenReturn(Optional.of(fakeEvent1));

        boolean expected = capoEventService.deleteById("1", fakeEvent1.id(), DeleteScope.ALL_IN_SERIES);

        assertTrue(expected);
    }

    @Test
    void deleteById_shouldReturnTrue_whenEventIsDeleted_After_THIS() {
        Mockito.when(capoEventRepo.findByIdAndCreatorId("1", "1")).thenReturn(Optional.of(fakeEvent1));

        boolean expected = capoEventService.deleteById("1", fakeEvent1.id(), DeleteScope.AFTER_THIS);

        assertTrue(expected);
    }


    @Test
    void deleteById_shouldReturnTrue_whenEventIsDeleted_BEFORE_THIS() {
        Mockito.when(capoEventRepo.findByIdAndCreatorId("1", "1")).thenReturn(Optional.of(fakeEvent1));

        boolean expected = capoEventService.deleteById("1", fakeEvent1.id(), DeleteScope.BEFORE_THIS);

        assertTrue(expected);
    }



    @Test
    void getPartOfSeriesDto_shouldThrowIllegalArgumentException_whenOccurrenceIndexIsLessThanZero() {
        assertThrows(IllegalArgumentException.class, () -> capoEventService.getPartOfSeriesDto("1", "1", -1));
    }

    @Test
    void getPartOfSeriesDto_shouldPass_andReturnDtoMatchingTheGivenDto(){

        Mockito.when(capoEventRepo.existsBySeriesIdAndIdNot("1", "1")).thenReturn(true);
        Mockito.when(capoEventRepo.existsBySeriesIdAndOccurrenceIndexIsLessThan("1", 5)).thenReturn(false);
        Mockito.when(capoEventRepo.existsBySeriesIdAndOccurrenceIndexIsGreaterThan("1", 5)).thenReturn(true);

        PartOfSeriesDto expected = new PartOfSeriesDto(true, false, true);
        PartOfSeriesDto actual = capoEventService.getPartOfSeriesDto("1", "1", 5);

        assertEquals(expected, actual);
    }
}