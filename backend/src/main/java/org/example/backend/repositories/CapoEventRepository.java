package org.example.backend.repositories;

import org.example.backend.models.CapoEvent;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CapoEventRepository extends MongoRepository<CapoEvent,String> {
    List<CapoEvent> findAllByCreatorId(String creatorId);

    boolean existsByIdNotAndEventStartAndLocationDataCountryAndLocationDataStateAndLocationDataCityAndLocationDataStreet(
            String excludedId,
            LocalDateTime eventStart,
            String country,
            String state,
            String city,
            String street
    );
}
