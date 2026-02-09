package org.example.backend.services;

import org.example.backend.models.CapoEvent;
import org.example.backend.repositoris.CapoEventRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CapoEventService {

    private final CapoEventRepository capoEventRepo;

    public CapoEventService(CapoEventRepository repo) {
        this.capoEventRepo = repo;
    }

    public List<CapoEvent> getAll(){
        return capoEventRepo.findAll();
    }
}
