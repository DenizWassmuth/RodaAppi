package org.example.backend.services;
import org.example.backend.models.BookmarkContainer;
import org.example.backend.repositories.BookmarkContainerRepository;
import org.springframework.stereotype.Service;

import java.util.*;


@Service
public class BookmarkService {

    BookmarkContainerRepository bookmarkContainerRepo;
    public BookmarkService(BookmarkContainerRepository bookmarkContainerRepo) {
        this.bookmarkContainerRepo = bookmarkContainerRepo;
    }

    void validateIds(String userId, String eventId){
        if (userId == null || eventId == null){
            throw new IllegalArgumentException("cannot access bookmarks if userId is null or eventId is null");
        }
    }

    private BookmarkContainer createBookmark(String userId){
        return bookmarkContainerRepo.save(new BookmarkContainer(userId, new ArrayList<>()));
    }

    public List<String> getAllBookmarkedEventsFromUser(String userId){

        BookmarkContainer bookMark = bookmarkContainerRepo.findById(userId).orElse(null);
        if(bookMark == null){
            return new ArrayList<>();
        }
        return bookMark.bookmarkedIds();
    }

    public boolean addEventIdToBookmarks(String userId, String eventId){

        validateIds(userId, eventId);

        BookmarkContainer bookmark = bookmarkContainerRepo.findById(userId).orElse(null);
        if (bookmark == null){
            bookmark = createBookmark(userId);
        }

        if (bookmark.bookmarkedIds().contains(eventId)){
            throw new MatchException("event is already bookmarked", new Throwable());
        }

        bookmark.bookmarkedIds().add(eventId);
        bookmarkContainerRepo.save(bookmark);
        return bookmark.bookmarkedIds().contains(eventId);
    }

    public boolean removeEventIdFromBookmark(String userId, String eventId) {

        validateIds(userId, eventId);

        BookmarkContainer bookmark = bookmarkContainerRepo.findById(userId).orElseThrow(() -> new NoSuchElementException("no bookmarks found for user " + userId));

        bookmark.bookmarkedIds().remove(eventId);
        if (bookmark.bookmarkedIds().isEmpty()) {
            bookmarkContainerRepo.deleteById(userId);
        }
        else {
            bookmarkContainerRepo.save(bookmark);
        }

        return !bookmark.bookmarkedIds().contains(eventId);
    }


}
