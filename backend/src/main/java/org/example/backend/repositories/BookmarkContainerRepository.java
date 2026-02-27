package org.example.backend.repositories;

import org.example.backend.models.BookmarkContainer;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookmarkContainerRepository extends MongoRepository<BookmarkContainer,String> {

    List<BookmarkContainer> findAllByBookmarkedIdsContaining(List<String> bookmarkedIds);
}
