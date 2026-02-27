package org.example.backend.services;


import org.example.backend.models.BookmarkContainer;
import org.example.backend.repositories.BookmarkContainerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookmarkCleanupService {

    BookmarkContainerRepository bookmarkContainerRepo;

    BookmarkCleanupService(BookmarkContainerRepository bookmarkContainerRepo) {
        this.bookmarkContainerRepo = bookmarkContainerRepo;
    }

    public void removeEventIdsFromAllBookmarkLists(List<String> eventIds) {
        if (eventIds == null || eventIds.isEmpty()) {
            return;
        }

        List<BookmarkContainer> bookmarkContainers = bookmarkContainerRepo.findAllByBookmarkedIdsContaining(eventIds);
        for (BookmarkContainer bookmarkContainer : bookmarkContainers) {

            bookmarkContainer.bookmarkedIds().removeAll(eventIds);
            if (bookmarkContainer.bookmarkedIds().isEmpty()) {
                bookmarkContainerRepo.deleteById(bookmarkContainer.id());
                continue;
            }

            bookmarkContainerRepo.save(bookmarkContainer);
        }
    }
}
