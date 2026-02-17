package org.example.backend.services;

import org.example.backend.dto.CapoEventRegDto;
import org.example.backend.models.CapoEvent;
import org.example.backend.repositories.CapoEventRepository;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;

@Service
public class CapoEventService {

    private final CapoEventRepository capoEventRepo;
    public CapoEventService(CapoEventRepository repo) {
        this.capoEventRepo = repo;
    }

    String createId(){
        return UUID.randomUUID().toString();
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
            throw new IllegalArgumentException("regDto is null");
        }

        CapoEvent newEvent = new CapoEvent(
                createId(),
                regDto.userId(),
                regDto.userName(),
                regDto.eventTitle(),
                regDto.eventDescription(),
                regDto.thumbnail(),
                regDto.locationData(),
                regDto.eventStart(),
                regDto.eventEnd(),
                regDto.eventType(),
                regDto.repRhythm()
        );

        // TODO: compare if same event already exists
        return capoEventRepo.save(newEvent);
    }

    public CapoEvent updateCapoEvent(String userId, String eventId, CapoEventRegDto updateDto) {

        if(userId == null){
            throw new IllegalArgumentException("userId is null");
        }

        if (eventId == null) {
            throw new IllegalArgumentException("eventId is null");
        }

        if (updateDto == null) {
            throw new IllegalArgumentException("updateDto is null");
        }

       CapoEvent refEvent = capoEventRepo.findById(eventId).orElseThrow(() -> new NoSuchElementException("id not found"));
       // CapoEvent refEvent = capoEventRepo.findById(id).orElse(null);

        if (!refEvent.creatorId().equals(userId)) {
            throw new MatchException("userId does not match creatorId", new Throwable());
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

       CapoEvent foundEvent = capoEventRepo.findById(eventId).orElse(null);
        if(foundEvent == null){
            return false;
        }

        if(!foundEvent.creatorId().equals(userId)){
           return false;
        }

        capoEventRepo.deleteById(eventId);
        return !capoEventRepo.existsById(eventId);
    }
}
