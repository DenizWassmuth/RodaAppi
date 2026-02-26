package org.example.backend.controllers;

import org.example.backend.services.BookmarkService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/bookmarks")
public class BookmarkController {

    private final BookmarkService bookmarkService;

    public BookmarkController(BookmarkService bookmarkService) {
        this.bookmarkService = bookmarkService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<List<String>> getBookmarksFromUser(@PathVariable String id) {

        List<String> bookmarks = bookmarkService.getAllBookmarkedEventsFromUser(id);
        return ResponseEntity.status(HttpStatus.OK).body(bookmarks);

    }

    @PutMapping("/{userId}/{eventId}")
    public ResponseEntity<Boolean> updateBookmark(@PathVariable String userId, @PathVariable String eventId) {

        try{
            boolean bAdded = bookmarkService.addEventIdToBookmarks(userId, eventId);
            return ResponseEntity.status(HttpStatus.OK).body(bAdded);
        }
        catch(IllegalArgumentException _) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
        catch(MatchException _){
            return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
        }
    }

    @DeleteMapping("/{userId}/{eventId}")
    public ResponseEntity<Boolean> deleteBookmark(@PathVariable String userId, @PathVariable String eventId) {

        try{
           boolean bRemoved =  bookmarkService.removeEventIdFromBookMark(userId, eventId);
           return ResponseEntity.status(HttpStatus.OK).body(bRemoved);
        }
        catch(IllegalArgumentException _){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
        catch (NoSuchElementException _) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }
}
