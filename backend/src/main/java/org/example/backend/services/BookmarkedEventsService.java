package org.example.backend.services;
import org.example.backend.models.BookMarkedEvents;
import org.example.backend.repositories.BookmarkedEventsRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;


@Service
public class BookmarkedEventsService {

    BookmarkedEventsRepository bookmarkedEventsRepo;
    public BookmarkedEventsService(BookmarkedEventsRepository bookmarkedEventsRepo) {
        this.bookmarkedEventsRepo = bookmarkedEventsRepo;
    }

    private BookMarkedEvents createBookmark(String userId){

        BookMarkedEvents bookmark = new BookMarkedEvents(userId, new ArrayList<>());
        bookmarkedEventsRepo.save(bookmark);
        return bookmark;
    }

    List<String> getAllBookmarkedEventsFromUser(String userId){

        BookMarkedEvents bookMark = bookmarkedEventsRepo.findById(userId).orElse(null);
        if(bookMark == null){
            return new ArrayList<>();
        }

        return bookMark.bookmarkedIds();
    }

    public boolean addEventIdToBookmarks(String userId, String eventId){

        if (userId == null || eventId == null){
            return false;
        }

        BookMarkedEvents bookmark = bookmarkedEventsRepo.findById(userId).orElse(null);
        if (bookmark == null){
            bookmark = createBookmark(userId);
        }

        if (bookmark.bookmarkedIds().contains(eventId)){
            return true;
        }

        return bookmark.bookmarkedIds().add(eventId);
    }

    public boolean removeEventIdFromBookMark(String userId, String eventId){

        if (userId == null || eventId == null){
            return false;
        }

        BookMarkedEvents bookmark = bookmarkedEventsRepo.findById(userId).orElse(null);
        if (bookmark == null){
            return false;
        }

       return bookmark.bookmarkedIds().remove(eventId);
    }
}
