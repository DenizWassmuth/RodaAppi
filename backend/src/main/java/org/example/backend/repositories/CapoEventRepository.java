package org.example.backend.repositories;

import org.example.backend.models.CapoEvent;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CapoEventRepository extends MongoRepository<CapoEvent,String> {
    List<CapoEvent> findAllByCreatorId(String creatorId);
}
