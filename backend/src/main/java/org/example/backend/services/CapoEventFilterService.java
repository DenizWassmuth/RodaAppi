package org.example.backend.services;
import org.example.backend.dto.CapoEventFilterDto;
import org.example.backend.models.CapoEvent;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class CapoEventFilterService {

    private final MongoTemplate mongoTemplate;

    public CapoEventFilterService(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }
    private boolean hasText(String s) {
        return s != null && !s.isBlank();
    }

    public java.util.List<CapoEvent> filter(CapoEventFilterDto dto) {

        Query query = new Query(); // Start with an empty query (matches everything).

        if (hasText(dto.country())) {
            query.addCriteria(Criteria.where("locationData.country").is(dto.country()));
        }

        if (hasText(dto.state())) {
            query.addCriteria(Criteria.where("locationData.state").is(dto.state()));
        }

        if (hasText(dto.city())) {
            query.addCriteria(Criteria.where("locationData.city").is(dto.city()));
        }

        if (dto.eventType() != null) {
            query.addCriteria(Criteria.where("eventType").is(dto.eventType()));
        }

        LocalDateTime startsAfter = dto.startsAfter();
        LocalDateTime startsBefore = dto.startsBefore();

        if (dto.upcomingOnly()) {
            LocalDateTime now = LocalDateTime.now();
            if (startsAfter == null || now.isAfter(startsAfter)) {
                startsAfter = now;
            }
        }

        if (startsAfter != null && startsBefore != null && startsBefore.isBefore(startsAfter)) {
            throw new IllegalArgumentException("startsBefore cannot be before startsAfter");
        }

        Criteria startCriteria = null;

        if (startsAfter != null) {
            startCriteria = Criteria.where("eventStart").gte(startsAfter);
        }

        if (startsBefore != null) {
            if (startCriteria == null) {
                startCriteria = Criteria.where("eventStart").lte(startsBefore);
            } else {
                startCriteria = startCriteria.lte(startsBefore);
            }
        }

        if (startCriteria != null) {
            query.addCriteria(startCriteria);
        }

        return mongoTemplate.find(query, CapoEvent.class); // Run query against the "capoevent" collection.
    }
}