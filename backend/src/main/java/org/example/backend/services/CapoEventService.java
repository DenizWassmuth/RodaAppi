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
    private String createdId(){
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

    public CapoEvent createCapoEvent(CapoEventRegDto RegDto){

        if(RegDto == null){
            return null;
        }

        CapoEvent newEvent = new CapoEvent(
                createdId(),
                RegDto.userId(),
                RegDto.userName(),
                RegDto.eventTitle(),
                RegDto.eventDescription(),
                RegDto.thumbnail(),
                RegDto.locationData(),
                RegDto.eventStart(),
                RegDto.eventEnd(),
                RegDto.eventType(),
                RegDto.repRhythm()
        );

        // TODO: compare if same event already exists

        capoEventRepo.save(newEvent);
        return newEvent;
    }

    // TODO fix frontend
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
