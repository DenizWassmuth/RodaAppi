package org.example.backend.controllers;

import org.example.backend.models.CapoEvent;
import org.example.backend.services.CapoEventService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

}
