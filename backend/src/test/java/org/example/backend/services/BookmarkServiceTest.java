package org.example.backend.services;

import org.example.backend.models.BookmarkContainer;
import org.example.backend.repositories.BookmarkContainerRepository;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

class BookmarkServiceTest {

    BookmarkContainerRepository bookmarkedEventsRepo = Mockito.mock(BookmarkContainerRepository.class);
    BookmarkService bookmarkService = new BookmarkService(bookmarkedEventsRepo);

    List<String> ids = new ArrayList<>(List.of("1", "2","3"));
    BookmarkContainer bookMarks1 = new BookmarkContainer("1", ids);

    @Test
    void getAllBookmarkedEventsFromUser_shouldReturnGivenList() {

        List<String> expected = bookMarks1.bookmarkedIds();

        Mockito.when(bookmarkedEventsRepo.findById("1")).thenReturn(Optional.of(bookMarks1));

        List <String> actual = bookmarkService.getAllBookmarkedEventsFromUser(bookMarks1.id());

        assertNotNull(actual);
        assertEquals(expected.size(), actual.size());
        assertEquals(expected.getFirst(), actual.getFirst());
    }

    @Test
    void getAllBookmarkedEventsFromUser_shouldThrowNoSuchElementException() {

        Mockito.when(bookmarkedEventsRepo.findById("1")).thenReturn(Optional.empty());
        String userId = bookMarks1.id();
        List<String> bookMarks = bookmarkService.getAllBookmarkedEventsFromUser(userId);

        assertNotNull(bookMarks);
        assertEquals(0, bookMarks.size());
    }

    @Test
    void addEventIdToBookmarks_shouldThrowIllegalArgumentException_whenUserIdIsNull() {
        assertThrows(IllegalArgumentException.class, () -> bookmarkService.addEventIdToBookmarks(null, "1"));
    }

    @Test
    void addEventIdToBookmarks_shouldThrowIllegalArgumentException_whenEventIdIsNull() {
        assertThrows(IllegalArgumentException.class, () -> bookmarkService.addEventIdToBookmarks("1", null));
    }

    @Test
    void addEventIdToBookmarks_shouldThrowMatchException_whenEventIdIsAlreadyContainedInBookMarks() {

        Mockito.when(bookmarkedEventsRepo.findById("1")).thenReturn(Optional.of(bookMarks1));

        assertThrows(MatchException.class, () -> bookmarkService.addEventIdToBookmarks("1", "1"));
    }

    @Test
    void addEventIdToBookmarks_shouldReturnTrue_whenEventIdIsAddedToBookMarks() {

        Mockito.when(bookmarkedEventsRepo.findById("1")).thenReturn(Optional.of(bookMarks1));

        boolean actual = bookmarkService.addEventIdToBookmarks("1", "4");
        assertTrue(actual);
    }

    @Test
    void removeEventIdFromBookmarks_shouldReturnFalse_whenUserIdIsNull() {
        assertThrows(IllegalArgumentException.class, () -> bookmarkService.removeEventIdFromBookmark(null, "1"));
    }

    @Test
    void removeEventIdFromBookmarks_shouldThrowIllegalArgumentException_whenEventIdIsNull() {
        assertThrows(IllegalArgumentException.class, () -> bookmarkService.removeEventIdFromBookmark("1", null));
    }

    @Test
    void removeEventIdFromBookmarks_shouldThrowNoSuchElementException_whenBookMarkedEventsIsNotContainedInRepo(){
        assertThrows(NoSuchElementException.class, () -> bookmarkService.removeEventIdFromBookmark("1", "1"));
    }

    @Test
    void removeEventIdFromBookmarks_shouldReturnTrue(){

        Mockito.when(bookmarkedEventsRepo.findById("1")).thenReturn(Optional.of(bookMarks1));

        boolean actual = bookmarkService.removeEventIdFromBookmark("1", "3");

        assertTrue(actual);
    }

    @Test
    void removeEventIdFromBookmarks_shouldReturnTrue_and_DeleteTheBookmarkContainerFromRepo(){

        List<String> ids2 = new ArrayList<>(List.of("1"));
        BookmarkContainer bookMarks2 = new BookmarkContainer("1", ids2);
        Mockito.when(bookmarkedEventsRepo.findById("1")).thenReturn(Optional.of(bookMarks2));

        boolean actual = bookmarkService.removeEventIdFromBookmark("1", "1");

        Mockito.verify(bookmarkedEventsRepo, Mockito.times(1)).deleteById("1");
        assertTrue(actual);
    }
}