package org.example.backend.services;
import org.example.backend.models.BookMarkedEvents;
import org.example.backend.repositories.BookmarkedEventsRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;


@Service
public class BookmarkService {

    BookmarkedEventsRepository bookmarkedEventsRepo;
    public BookmarkService(BookmarkedEventsRepository bookmarkedEventsRepo) {
        this.bookmarkedEventsRepo = bookmarkedEventsRepo;
    }

    private BookMarkedEvents createBookmark(String userId){

        return bookmarkedEventsRepo.save(new BookMarkedEvents(userId, new ArrayList<>()));
    }

    List<String> getAllBookmarkedEventsFromUser(String userId){

        BookMarkedEvents bookMark = bookmarkedEventsRepo.findById(userId).orElseThrow(() -> new NoSuchElementException("no bookmarks found for user " + userId));
        return bookMark.bookmarkedIds();
    }

    public boolean addEventIdToBookmarks(String userId, String eventId){

        if (userId == null || eventId == null){
            throw new IllegalArgumentException("cannot access bookmarks if userId is null or eventId is null");
        }

        BookMarkedEvents bookmark = bookmarkedEventsRepo.findById(userId).orElse(null);
        if (bookmark == null){
            bookmark = createBookmark(userId);
        }

        if (bookmark.bookmarkedIds().contains(eventId)){
            throw new MatchException("event is already bookmarked", new Throwable());
        }

        bookmark.bookmarkedIds().add(eventId);
        bookmarkedEventsRepo.save(bookmark);
        return bookmark.bookmarkedIds().contains(eventId);
    }

    public boolean removeEventIdFromBookMark(String userId, String eventId){

        if (userId == null || eventId == null){
            throw new IllegalArgumentException("cannot access bookmarks if userId is null or eventId is null");
        }

        BookMarkedEvents bookmark = bookmarkedEventsRepo.findById(userId).orElseThrow(() -> new NoSuchElementException("no bookmarks found for user " + userId));

       return bookmark.bookmarkedIds().remove(eventId);
    }
}
