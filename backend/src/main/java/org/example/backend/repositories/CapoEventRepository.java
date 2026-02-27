package org.example.backend.repositories;

import org.example.backend.models.CapoEvent;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

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

    Optional<CapoEvent> findByIdAndCreatorId(String id, String creatorId);

    List<CapoEvent> findAllBySeriesId(String seriesId);
    List<CapoEvent> findAllBySeriesIdAndOccurrenceIndexIsLessThanEqual(String seriesId, int occurrenceIndex);
    List<CapoEvent> findAllBySeriesIdAndOccurrenceIndexIsGreaterThanEqual(String seriesId, int occurrenceIndex);

    boolean existsBySeriesIdAndIdNot(String seriesId, String excludeEventId);
    boolean existsBySeriesIdAndOccurrenceIndexIsLessThan(String seriesId, int occurrenceIndex);
    boolean existsBySeriesIdAndOccurrenceIndexIsGreaterThan(String seriesId, int occurrenceIndex);

    void deleteByIdAndCreatorId(String id, String creatorId);
    void deleteAllBySeriesId(String seriesId);
    void deleteAllBySeriesIdAndOccurrenceIndexIsLessThanEqual(String seriesId, int occurrenceIndex);
    void deleteAllBySeriesIdAndOccurrenceIndexIsGreaterThanEqual(String seriesId, int occurrenceIndex);
}
