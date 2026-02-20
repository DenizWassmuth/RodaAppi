package org.example.backend.controllers;

import org.example.backend.dto.CapoEventRegDto;
import org.example.backend.enums.DeleteScope;
import org.example.backend.models.CapoEvent;
import org.example.backend.services.CapoEventService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/capoevent")
public class CapoEventController {

    private final CapoEventService capoEventService;
    public CapoEventController(CapoEventService capoEventService) {
        this.capoEventService = capoEventService;
    }

    @GetMapping
    public List<CapoEvent> getAll() {
        return capoEventService.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CapoEvent> getById(@PathVariable String id) {

        CapoEvent foundEvent = capoEventService.getById(id);
        if (foundEvent == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        return ResponseEntity.status(HttpStatus.OK).body(foundEvent);
    }

    @PostMapping()
    public ResponseEntity<CapoEvent> create(@RequestBody CapoEventRegDto regDto) {

        try{
            CapoEvent newEvent = capoEventService.createCapoEvent(regDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(newEvent);
        }
        catch (IllegalArgumentException ex){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        catch(MatchException ex){
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
    }

    @PutMapping("/update/{userId}/{eventId}")
    public ResponseEntity<CapoEvent> update(@PathVariable String userId, @PathVariable String eventId, @RequestBody CapoEventRegDto regDto) {

        try{
            CapoEvent updatedEvent = capoEventService.updateCapoEvent(userId, eventId, regDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(updatedEvent);
        }
        catch (IllegalArgumentException ex){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        catch(NoSuchElementException ex){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        catch(MatchException ex){
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

    }

    @DeleteMapping("/delete/{userId}/{eventId}")
    public ResponseEntity<Boolean> deleteById(@PathVariable String userId, @PathVariable String eventId, @RequestParam (defaultValue = "ONLY_THIS") DeleteScope deleteScope) {

        try {
            if (capoEventService.deleteById(userId, eventId, deleteScope)) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
            }
        }
        catch (NoSuchElementException noSuchElementException) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }
}
