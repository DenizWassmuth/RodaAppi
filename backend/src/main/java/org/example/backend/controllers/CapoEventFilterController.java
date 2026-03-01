package org.example.backend.controllers;

import org.example.backend.dto.CapoEventFilterDto;
import org.example.backend.models.CapoEvent;
import org.example.backend.services.CapoEventFilterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/capoevent/filters")
public class CapoEventFilterController {

    CapoEventFilterService capoEventFilterService;

    CapoEventFilterController(CapoEventFilterService capoEventFilterService) {
        this.capoEventFilterService = capoEventFilterService;
    }

    @PostMapping("/search")
    public ResponseEntity<List<CapoEvent>> filter(@RequestBody CapoEventFilterDto dto) {
        try {
            return ResponseEntity.ok(capoEventFilterService.filter(dto));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
