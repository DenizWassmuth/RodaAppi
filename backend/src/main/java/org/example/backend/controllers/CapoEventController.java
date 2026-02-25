package org.example.backend.controllers;

import lombok.extern.slf4j.Slf4j;
import org.example.backend.dto.CapoEventRegDto;
import org.example.backend.dto.PartOfSeriesDto;
import org.example.backend.enums.EditScope;
import org.example.backend.models.CapoEvent;
import org.example.backend.services.CapoEventService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;

@Slf4j
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
        catch (IllegalArgumentException _){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        catch(MatchException _){
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
    }

    @PutMapping("/update/{userId}/{eventId}")
    public ResponseEntity<CapoEvent> update(@PathVariable String userId, @PathVariable String eventId, @RequestBody CapoEventRegDto regDto, @RequestParam (defaultValue = "ONLY_THIS") EditScope editScope) {

        try{
            CapoEvent updatedEvent = capoEventService.updateCapoEvent(userId, eventId, regDto, editScope);
            return ResponseEntity.status(HttpStatus.CREATED).body(updatedEvent);
        }
        catch (IllegalArgumentException _){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        catch(NoSuchElementException _){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        catch(MatchException _){
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
    }

    @GetMapping("/{eventId}/{seriesId}/{occurrenceIndex}")
    public ResponseEntity<PartOfSeriesDto> getPartOfSeries(@PathVariable String eventId, @PathVariable String seriesId, @PathVariable int occurrenceIndex) {

        try{
            PartOfSeriesDto dto = capoEventService.getPartOfSeriesDto(eventId,seriesId,occurrenceIndex);
            return ResponseEntity.status(HttpStatus.OK).body(dto);
        }
        catch (IllegalArgumentException _){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @DeleteMapping("/delete/{userId}/{eventId}")
    public ResponseEntity<Void> deleteById(@PathVariable String userId, @PathVariable String eventId, @RequestParam (defaultValue = "ONLY_THIS") EditScope editScope) {

        try {
            capoEventService.deleteById(userId, eventId, editScope) ;
        }
        catch (NoSuchElementException _) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        catch(IllegalArgumentException _){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
