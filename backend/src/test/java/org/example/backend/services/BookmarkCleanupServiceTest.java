package org.example.backend.services;

import org.example.backend.models.BookmarkContainer;
import org.example.backend.repositories.BookmarkContainerRepository;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.ArrayList;
import java.util.List;

import static org.mockito.Mockito.*;

class BookmarkCleanupServiceTest {

    private final BookmarkContainerRepository bookmarkContainerRepo = Mockito.mock(BookmarkContainerRepository.class);
    private final BookmarkCleanupService bookmarkCleanupService = new BookmarkCleanupService(bookmarkContainerRepo);

    @Test
    void removeEventIdsFromAllBookmarkLists_shouldReturnImmediately_whenEventIdsIsNull() {
        bookmarkCleanupService.removeEventIdsFromAllBookmarkLists(null);

        verifyNoInteractions(bookmarkContainerRepo);
    }

    @Test
    void removeEventIdsFromAllBookmarkLists_shouldReturnImmediately_whenEventIdsIsEmpty() {
        bookmarkCleanupService.removeEventIdsFromAllBookmarkLists(List.of());

        verifyNoInteractions(bookmarkContainerRepo);
    }

    @Test
    void removeEventIdsFromAllBookmarkLists_shouldRemoveIds_andSave_whenContainerNotEmptyAfterRemoval() {
        List<String> idsToRemove = List.of("e1", "e2");

        BookmarkContainer c1 = new BookmarkContainer("u1", new ArrayList<>(List.of("e1", "e3", "e4")));

        when(bookmarkContainerRepo.findAllByBookmarkedIdsContaining(idsToRemove))
                .thenReturn(List.of(c1));

        bookmarkCleanupService.removeEventIdsFromAllBookmarkLists(idsToRemove);

        verify(bookmarkContainerRepo, times(1)).save(c1);
        verify(bookmarkContainerRepo, never()).deleteById(anyString());
    }

    @Test
    void removeEventIdsFromAllBookmarkLists_shouldDeleteContainer_whenBecomesEmptyAfterRemoval() {
        List<String> idsToRemove = List.of("e1", "e2");

        BookmarkContainer c1 = new BookmarkContainer("u1", new ArrayList<>(List.of("e1", "e2")));

        when(bookmarkContainerRepo.findAllByBookmarkedIdsContaining(idsToRemove))
                .thenReturn(List.of(c1));

        bookmarkCleanupService.removeEventIdsFromAllBookmarkLists(idsToRemove);

        verify(bookmarkContainerRepo, times(1)).deleteById("u1");
        verify(bookmarkContainerRepo, never()).save(any());
    }

    @Test
    void removeEventIdsFromAllBookmarkLists_shouldContinueAfterDelete_andProcessNextContainers() {
        List<String> idsToRemove = List.of("e1");

        BookmarkContainer c1 = new BookmarkContainer("u1", new ArrayList<>(List.of("e1")));        // becomes empty -> delete
        BookmarkContainer c2 = new BookmarkContainer("u2", new ArrayList<>(List.of("e1", "e9")));  // becomes ["e9"] -> save

        when(bookmarkContainerRepo.findAllByBookmarkedIdsContaining(idsToRemove))
                .thenReturn(List.of(c1, c2));

        bookmarkCleanupService.removeEventIdsFromAllBookmarkLists(idsToRemove);

        verify(bookmarkContainerRepo, times(1)).deleteById("u1");
        verify(bookmarkContainerRepo, times(1)).save(c2);
    }

}