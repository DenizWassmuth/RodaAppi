package org.example.backend.services;

import org.example.backend.dto.CapoEventRegDto;
import org.example.backend.dto.PartOfSeriesDto;
import org.example.backend.enums.EditScope;
import org.example.backend.enums.RepetitionRhythmEnumType;
import org.example.backend.models.CapoEvent;
import org.example.backend.repositories.CapoEventRepository;
import org.springframework.stereotype.Service;

import java.awt.print.Book;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;


@Service
public class CapoEventService {

    private final CapoEventRepository capoEventRepo;
    private final BookmarkCleanupService bookmarkCleanupService;

    public CapoEventService(CapoEventRepository repo, BookmarkCleanupService bookmarkCleanupService) {

        this.capoEventRepo = repo;
        this.bookmarkCleanupService = bookmarkCleanupService;
    }

    String createId(){
        return UUID.randomUUID().toString();
    }

    boolean eventAlreadyExists(String idToExclude, CapoEventRegDto regDto){

        if (regDto == null){
            throw new IllegalArgumentException("event cannot be null if it is to be compared to existing events");
        }

        return capoEventRepo
                .existsByIdNotAndEventStartAndLocationDataCountryAndLocationDataStateAndLocationDataCityAndLocationDataStreet(
                        idToExclude,
                        regDto.eventStart(),
                        regDto.locationData().country(),
                        regDto.locationData().state(),
                        regDto.locationData().city(),
                        regDto.locationData().street()
        );
    }

    LocalDateTime shiftLocalDateTime(LocalDateTime toShift, RepetitionRhythmEnumType rhythm) {

        return switch (rhythm) {
            case DAILY -> toShift.plusDays(1);
            case WEEKLY -> toShift.plusWeeks(1);
            case MONTHLY -> toShift.plusMonths(1);
            case QUARTERLY -> toShift.plusMonths(3);
            case YEARLY -> toShift.plusYears(1);
            case CUSTOM -> throw new IllegalArgumentException("CUSTOM needs extra fields (interval/days)");
            case ONCE -> toShift;
        };
    }

    public List<CapoEvent> getAll(){
        return capoEventRepo.findAll();
    }

    public List<CapoEvent> getAllByCreatorId(String creatorId){
        return capoEventRepo.findAllByCreatorId(creatorId);
    }

    public CapoEvent getById(String id){
        return capoEventRepo.findById(id).orElse(null);
    }

    public CapoEvent createCapoEvent(CapoEventRegDto regDto){

        if (regDto == null) {
            throw new IllegalArgumentException("cannot create new event, as regDto is null");
        }

        if (regDto.repRhythm() != RepetitionRhythmEnumType.ONCE && regDto.repUntil().isBefore(regDto.eventStart())) {
            throw new IllegalArgumentException("cannot create new events, as first eventStart is after repetition cycle end ");
        }

        List<CapoEvent> capoEvents = new ArrayList<>();

        String seriesId = createId();
        int index = 0;

        LocalDateTime startDate = regDto.eventStart();
        LocalDateTime endDate = regDto.eventEnd();

        while(regDto.repRhythm() == RepetitionRhythmEnumType.ONCE || startDate.isBefore(regDto.repUntil())){

            if (eventAlreadyExists(null, regDto)) {
                throw new MatchException("cannot create new event, event already exists", new Throwable());
            }

            capoEvents.add(new CapoEvent(
                    createId(),
                    regDto.userId(),
                    seriesId,
                    index,
                    regDto.userName(),
                    regDto.eventTitle(),
                    regDto.eventDescription(),
                    regDto.thumbnail(),
                    regDto.locationData(),
                    startDate,
                    endDate,
                    regDto.eventType(),
                    regDto.repRhythm()
            ));

            if(regDto.repRhythm() == RepetitionRhythmEnumType.ONCE){
                break;
            }

            startDate = shiftLocalDateTime(startDate, regDto.repRhythm());
            endDate = shiftLocalDateTime(endDate, regDto.repRhythm());
            index++;
        }

        capoEventRepo.saveAll(capoEvents);
        return capoEvents.getFirst();
    }

    public CapoEvent updateCapoEvent(String userId, String eventId, CapoEventRegDto updateDto, EditScope editScope) {

        if(userId == null){
            throw new IllegalArgumentException("cannot update event, as userId is null");
        }

        if (eventId == null) {
            throw new IllegalArgumentException("cannot update event, as eventId is null");
        }

        if (updateDto == null) {
            throw new IllegalArgumentException("cannot update event, as updateDto is null");
        }

        LocalDateTime newStart = updateDto.eventStart();
        LocalDateTime newEnd = updateDto.eventEnd();

        if (newEnd.isBefore(newStart)) {
            throw new IllegalArgumentException("cannot update event times because end is before start");
        }

//        if (eventAlreadyExists(eventId, updateDto)) {
//            throw new MatchException("cannot create new event, event already exists", new Throwable());
//        }

        CapoEvent eventToUpdate = capoEventRepo.findByIdAndCreatorId(eventId, userId).
                orElseThrow(() -> new NoSuchElementException("cannot update event with id:" + eventId + ", as it was not found in db"));


        String seriesId = eventToUpdate.seriesId();
        int index = eventToUpdate.occurrenceIndex();

        List<CapoEvent> capoEvents = new ArrayList<>();

        switch (editScope) {
            case ONLY_THIS ->
                    capoEvents.add(eventToUpdate);
            case ALL_IN_SERIES ->
                    capoEvents.addAll(capoEventRepo.findAllBySeriesId(seriesId));
            case BEFORE_THIS ->
                    capoEvents.addAll(capoEventRepo.findAllBySeriesIdAndOccurrenceIndexIsLessThanEqual(seriesId, index));
            case AFTER_THIS ->
                    capoEvents.addAll(capoEventRepo.findAllBySeriesIdAndOccurrenceIndexIsGreaterThanEqual(seriesId, index));
        }

        LocalDateTime origStart = eventToUpdate.eventStart();
        LocalDateTime origEnd = eventToUpdate.eventEnd();

        Duration startShift = Duration.between(origStart, newStart);
        Duration endShift = Duration.between(origEnd, newEnd);

        List<CapoEvent> updatedCapoEvents = new ArrayList<>();

        for (CapoEvent refEvent : capoEvents) {

            updatedCapoEvents.add(refEvent
                    .withEventTitle(updateDto.eventTitle())
                    .withEventDescription(updateDto.eventDescription())
                    .withThumbnail(updateDto.thumbnail())
                    .withLocationData(updateDto.locationData()) // TODO: change to only street
                    .withEventStart(refEvent.eventStart().plus(startShift))
                    .withEventEnd(refEvent.eventEnd().plus(endShift)));
        }

        capoEventRepo.saveAll(updatedCapoEvents);

        return capoEventRepo.findById(eventId).orElseThrow(() -> new NoSuchElementException("cannot find event with id:" + eventId));
    }

    public PartOfSeriesDto getPartOfSeriesDto(String eventId, String seriesId, int occurrenceIndex){

        if(occurrenceIndex < 0){
            throw new IllegalArgumentException("cannot verify if event is part of series, as occurrenceIndex is < 0>");
        }

        return new PartOfSeriesDto(
                capoEventRepo.existsBySeriesIdAndIdNot(seriesId, eventId),
                capoEventRepo.existsBySeriesIdAndOccurrenceIndexIsLessThan(seriesId,occurrenceIndex ),
                capoEventRepo.existsBySeriesIdAndOccurrenceIndexIsGreaterThan(seriesId, occurrenceIndex)
        );
    }

    public boolean deleteById(String userId, String eventId, EditScope editScope){

       CapoEvent foundEvent = capoEventRepo.findByIdAndCreatorId(eventId, userId).orElseThrow(() -> new NoSuchElementException("cannot delete event with userId:" + userId + " and eventId:" + eventId + ", as it was not found in db"));

        List<String> eventIds = switch (editScope) {
            case ONLY_THIS -> List.of(foundEvent.id());
            case ALL_IN_SERIES ->
                    capoEventRepo.findAllBySeriesId(foundEvent.seriesId())
                            .stream().map(CapoEvent::id).toList();
            case BEFORE_THIS ->
                    capoEventRepo.findAllBySeriesIdAndOccurrenceIndexIsLessThanEqual(foundEvent.seriesId(), foundEvent.occurrenceIndex())
                            .stream().map(CapoEvent::id).toList();
            case AFTER_THIS ->
                    capoEventRepo.findAllBySeriesIdAndOccurrenceIndexIsGreaterThanEqual(foundEvent.seriesId(), foundEvent.occurrenceIndex())
                            .stream().map(CapoEvent::id).toList();
        };

        switch (editScope) {
            case ONLY_THIS -> capoEventRepo.deleteByIdAndCreatorId(eventId, userId);
            case ALL_IN_SERIES -> capoEventRepo.deleteAllBySeriesId(foundEvent.seriesId());
            case BEFORE_THIS -> capoEventRepo.deleteAllBySeriesIdAndOccurrenceIndexIsLessThanEqual(foundEvent.seriesId(), foundEvent.occurrenceIndex());
            case AFTER_THIS -> capoEventRepo.deleteAllBySeriesIdAndOccurrenceIndexIsGreaterThanEqual(foundEvent.seriesId(), foundEvent.occurrenceIndex());
            default -> throw new IllegalArgumentException("cannot delete event with id:" + eventId + ", as editScope is no known enum value");
        }

        bookmarkCleanupService.removeEventIdsFromAllBookmarkLists(eventIds);

        return !capoEventRepo.existsById(eventId);
    }
}
