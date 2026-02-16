package org.example.backend.controllers;

import org.example.backend.models.CapoEvent;
import org.example.backend.services.CapoEventService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(foundEvent);
    }

    @DeleteMapping("/{userId}/{eventId}")
    public ResponseEntity<Boolean> deleteById(@PathVariable String userId, @PathVariable String eventId) {

        if (capoEventService.deleteById(userId, eventId)) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.notFound().build();
    }
}
