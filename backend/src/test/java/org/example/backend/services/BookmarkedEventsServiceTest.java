package org.example.backend.services;

import org.example.backend.models.BookMarkedEvents;
import org.example.backend.repositories.BookmarkedEventsRepository;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;


class BookmarkedEventsServiceTest {

    BookmarkedEventsRepository bookmarkedEventsRepo = Mockito.mock(BookmarkedEventsRepository.class);
    BookmarkedEventsService bookmarkedEventsService = new BookmarkedEventsService(bookmarkedEventsRepo);

    List<String> ids = new ArrayList<>(List.of("1", "2","3"));
    BookMarkedEvents bookMark1 = new BookMarkedEvents("1", ids);

    @Test
    void getAllBookmarkedEventsFromUser_shouldReturnGivenList() {

        List<String> expected = bookMark1.bookmarkedIds();

        Mockito.when(bookmarkedEventsRepo.findById("1")).thenReturn(Optional.of(bookMark1));

        List <String> actual = bookmarkedEventsService.getAllBookmarkedEventsFromUser(bookMark1.id());

        assertNotNull(actual);
        assertEquals(expected.size(), actual.size());
        assertEquals(expected.getFirst(), actual.getFirst());
    }

    @Test
    void getAllBookmarkedEventsFromUser_shouldReturnEmptyList() {

        Mockito.when(bookmarkedEventsRepo.findById("1")).thenReturn(Optional.empty());

        List <String> actual = bookmarkedEventsService.getAllBookmarkedEventsFromUser(bookMark1.id());

        assertNotNull(actual);
        assertEquals(0, actual.size());
    }

    @Test
    void addEventIdToBookmarks_shouldReturnFalse_whenUserIdIsNull() {

        boolean actual = bookmarkedEventsService.addEventIdToBookmarks(null, "1");
        assertFalse(actual);
    }

    @Test
    void addEventIdToBookmarks_shouldReturnFalse_whenEventIdIsNull() {

        boolean actual = bookmarkedEventsService.addEventIdToBookmarks("1", null);
        assertFalse(actual);
    }

    @Test
    void addEventIdToBookmarks_shouldReturnTrue_whenEventIdIsAlreadyContainedInBookMarks() {

        Mockito.when(bookmarkedEventsRepo.findById("1")).thenReturn(Optional.of(bookMark1));

        boolean actual = bookmarkedEventsService.addEventIdToBookmarks("1", "1");
        assertTrue(actual);
    }

    @Test
    void addEventIdToBookmarks_shouldReturnTrue_whenEventIdIsAddedToBookMarks() {

        Mockito.when(bookmarkedEventsRepo.findById("1")).thenReturn(Optional.of(bookMark1));

        boolean actual = bookmarkedEventsService.addEventIdToBookmarks("4", "1");
        assertTrue(actual);
    }

    @Test
    void removeEventIdFromBookmarks_shouldReturnFalse_whenUserIdIsNull() {

        boolean actual = bookmarkedEventsService.removeEventIdFromBookMark(null, "1");
        assertFalse(actual);
    }

    @Test
    void removeEventIdFromBookmarks_shouldReturnFalse_whenEventIdIsNull() {

        boolean actual = bookmarkedEventsService.removeEventIdFromBookMark("1", null);
        assertFalse(actual);
    }

    @Test
    void removeEventIdFromBookmarks_shouldReturnFalse_whenBookMarkedEventsIsNotContainedInRepo(){

        Mockito.when(bookmarkedEventsRepo.findById("1")).thenReturn(Optional.of(bookMark1));

        boolean actual = bookmarkedEventsService.removeEventIdFromBookMark("1", "4");
        assertFalse(actual);
    }

    @Test
    void removeEventIdFromBookmarks_shouldReturnTrue(){

        Mockito.when(bookmarkedEventsRepo.findById("1")).thenReturn(Optional.of(bookMark1));

        boolean actual = bookmarkedEventsService.removeEventIdFromBookMark("1", "3");
        assertTrue(actual);
    }
}