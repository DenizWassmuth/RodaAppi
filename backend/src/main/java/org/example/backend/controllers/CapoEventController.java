package org.example.backend.controllers;

import org.example.backend.dto.CapoEventRegDto;
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
        CapoEvent newEvent = capoEventService.createCapoEvent(regDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(newEvent);
    }

    @PutMapping("/update/{userId}/{eventId}")
    public ResponseEntity<CapoEvent> update(@PathVariable String userId, @PathVariable String eventId, @RequestBody CapoEventRegDto regDto) {
        CapoEvent updatedEvent = capoEventService.updateCapoEvent(userId, eventId, regDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(updatedEvent);
    }

    @DeleteMapping("/delete/{userId}/{eventId}")
    public ResponseEntity<Boolean> deleteById(@PathVariable String userId, @PathVariable String eventId) {

        try {
            if (capoEventService.deleteById(userId, eventId)) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
            }
        }
        catch (MatchException matchException) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        catch (NoSuchElementException noSuchElementException) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
}
