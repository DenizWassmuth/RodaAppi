package org.example.backend.services;
import org.example.backend.dto.CapoEventFilterDto;
import org.example.backend.models.CapoEvent;
import org.example.backend.repositories.BookmarkContainerRepository;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CapoEventFilterService {

    private final BookmarkContainerRepository bookmarkRepository;
    private final MongoTemplate mongoTemplate;

    public CapoEventFilterService(MongoTemplate mongoTemplate,  BookmarkContainerRepository bookmarkRepository) {
        this.mongoTemplate = mongoTemplate;
        this.bookmarkRepository = bookmarkRepository;
    }
    private boolean hasText(String s) {
        return s != null && !s.isBlank();
    }

    public List<CapoEvent> filter(CapoEventFilterDto dto) {

        Query query = new Query();

        boolean creatorIdIsValid = dto.creatorId() != null && !dto.creatorId().isBlank();

        if (Boolean.TRUE.equals(dto.isDashboardContent()) && creatorIdIsValid) {
            query.addCriteria(Criteria.where("creatorId").is(dto.creatorId()));
        }

        if (Boolean.TRUE.equals(dto.bookmarkedOnly()) && creatorIdIsValid) {
            bookmarkRepository.findById(dto.creatorId()).ifPresent(bookmarkContainer ->
                    query.addCriteria(Criteria.where("_id").in(bookmarkContainer.bookmarkedIds())));
        }

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

        Integer upcomingDays = dto.upcomingDays();
        if (upcomingDays != null && upcomingDays > 0) {

            LocalDateTime now = LocalDateTime.now();
            now = now.withHour(0).withMinute(0).withSecond(0).withNano(0);
            LocalDateTime until = now.plusDays(upcomingDays + 1 );

            if (startsAfter == null || now.isAfter(startsAfter)) {
                startsAfter = now;
            }

            if (startsBefore == null || until.isBefore(startsBefore)) {
                startsBefore = until;
            }
        }

        if (startsAfter != null && startsBefore != null && startsBefore.isBefore(startsAfter)) {
            throw new IllegalArgumentException("startsBefore cannot be before startsAfter");
        }

        boolean hasStartBound = false;
        Criteria startCriteria = Criteria.where("eventStart");

        if (startsAfter != null) {
            startsAfter = startsAfter.withHour(0).withMinute(0).withSecond(0).withNano(0);
            startCriteria = startCriteria.gte(startsAfter);
            hasStartBound = true;
        }

        if (startsBefore != null) {
            startsBefore = startsBefore.withHour(23).withMinute(59).withSecond(59).withNano(0);
            startCriteria = startCriteria.lte(startsBefore);
            hasStartBound = true;
        }

        if (hasStartBound) {
            query.addCriteria(startCriteria);
        }

        if (Boolean.TRUE.equals(dto.recentOnly())) {
            query.with(Sort.by(Sort.Direction.DESC, "createdAt"));
        } else {
            query.with(Sort.by(Sort.Direction.ASC, "eventStart"));
        }

        int limit = dto.limit() == null ? 20 : dto.limit();
        if (limit != 10 && limit != 20 && limit != 30) {
            limit = 20;
        }
        query.limit(limit);

        return mongoTemplate.find(query, CapoEvent.class);
    }
}