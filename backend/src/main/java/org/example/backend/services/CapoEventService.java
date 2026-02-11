package org.example.backend.services;

import org.example.backend.models.CapoEvent;
import org.example.backend.repositories.CapoEventRepository;
import org.springframework.http.ResponseEntity;
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

    public CapoEvent getById(String id){
        return capoEventRepo.findById(id).orElse(null);
    }

    public boolean deleteById(String id){

        if(capoEventRepo.existsById(id)){
            capoEventRepo.deleteById(id);
            return true;
        }

        return false;
    }
}
