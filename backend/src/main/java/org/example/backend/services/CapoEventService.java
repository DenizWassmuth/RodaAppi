package org.example.backend.services;

import org.example.backend.dto.CapoEventRegDto;
import org.example.backend.models.CapoEvent;
import org.example.backend.repositories.CapoEventRepository;
import org.springframework.stereotype.Service;

import java.util.List;
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
