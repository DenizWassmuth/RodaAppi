package org.example.backend.repositories;

import org.example.backend.models.BookMarkedEvents;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookmarkedEventsRepository extends MongoRepository<BookMarkedEvents,String> {
}
