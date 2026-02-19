package org.example.backend.services;

import org.example.backend.dto.CapoEventRegDto;
import org.example.backend.enums.RepetitionRhythmEnumType;
import org.example.backend.models.CapoEvent;
import org.example.backend.repositories.CapoEventRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Stream;

@Service
public class CapoEventService {

    private final CapoEventRepository capoEventRepo;
    public CapoEventService(CapoEventRepository repo) {
        this.capoEventRepo = repo;
    }

    String createId(){
        return UUID.randomUUID().toString();
    }

    boolean eventAlreadyExists(String idToExclude, CapoEventRegDto regDto){

        if (regDto == null){
            throw new IllegalArgumentException("event cannot be null if it is to be compared to existing events");
        }

//        List<CapoEvent> existingEvents = capoEventRepo.findAll();
//        if(existingEvents.isEmpty()){
//            return false;
//        }
//
//        List<CapoEvent> filtered = existingEvents.stream().filter(
//                e -> !e.id().equals(idToExclude)).toList()
//                .stream().filter(
//                        e -> e.eventStart().equals(regDto.eventStart())).toList()
//                .stream().filter(
//                        e -> e.locationData().country().equals(regDto.locationData().country()) &&
//                                e.locationData().state().equals(regDto.locationData().state()) &&
//                                e.locationData().city().equals(regDto.locationData().city()) &&
//                                e.locationData().street().equals(regDto.locationData().street())).toList();
//
//        return !filtered.isEmpty();

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

    private LocalDateTime shiftLocalDateTime(LocalDateTime toShift, RepetitionRhythmEnumType rhythm) {

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

        if (regDto.repRhythm() != RepetitionRhythmEnumType.ONCE) {
            if (regDto.repUntil().isBefore(regDto.eventStart())) {
                throw new IllegalArgumentException("cannot create new events, as first eventStart is after repetition cycle end ");
            }
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

    public CapoEvent updateCapoEvent(String userId, String eventId, CapoEventRegDto updateDto) {

        if(userId == null){
            throw new IllegalArgumentException("cannot update event, as userId is null");
        }

        if (eventId == null) {
            throw new IllegalArgumentException("cannot update event, as eventId is null");
        }

        if (updateDto == null) {
            throw new IllegalArgumentException("cannot update event, as updateDto is null");
        }

        if (eventAlreadyExists(eventId,updateDto)) {
            throw new MatchException("cannot create new event, event already exists", new Throwable());
        }

       CapoEvent refEvent = capoEventRepo.findById(eventId).orElseThrow(() -> new NoSuchElementException("cannot update event with id:" + eventId + ", as it was not found in db"));

        if (!refEvent.creatorId().equals(userId)) {
            throw new MatchException("cannot update event, as userId does not match creatorId", new Throwable());
        }

        CapoEvent updatedEvent = refEvent
                .withEventTitle(updateDto.eventTitle())
                .withEventDescription(updateDto.eventDescription())
                .withThumbnail(updateDto.thumbnail())
                .withLocationData(updateDto.locationData())
                .withEventStart(updateDto.eventStart())
                .withEventEnd(updateDto.eventEnd())
                .withEventType(updateDto.eventType())
                .withRepRhythm(updateDto.repRhythm());

        return capoEventRepo.save(updatedEvent);
    }

    public boolean deleteById(String userId, String eventId){

       CapoEvent foundEvent = capoEventRepo.findById(eventId).orElseThrow(() -> new NoSuchElementException("cannot delete event with id:" + eventId + ", as it was not found in db"));

        if(!foundEvent.creatorId().equals(userId)){
            throw new MatchException("cannot delete event with id:" + eventId + ", as userId does not match creatorId", new Throwable());
        }

        capoEventRepo.deleteById(eventId);
        return !capoEventRepo.existsById(eventId);
    }
}
