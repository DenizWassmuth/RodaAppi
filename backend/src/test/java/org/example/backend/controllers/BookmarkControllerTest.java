package org.example.backend.controllers;

import org.example.backend.models.BookmarkContainer;
import org.example.backend.repositories.BookmarkContainerRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class BookmarkControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private BookmarkContainerRepository bookmarkContainerRepository;

    @BeforeEach
    void cleanDB(){
        bookmarkContainerRepository.deleteAll();
    }

    @Test
    void getBookmarksFromUser_shouldReturnOk_andEmptyList_whenUserHasNoBookmarkDoc() throws Exception {

        mockMvc.perform(get("/api/bookmarks/1"))
                .andExpect(status().isOk())
                .andExpect(content().json("[]"));
    }

    @Test
    void getBookmarksFromUser_shouldReturnOk_andList_whenUserHasBookmarks() throws Exception {
        bookmarkContainerRepository.save(new BookmarkContainer("1", List.of("e1", "e2")));

        mockMvc.perform(get("/api/bookmarks/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0]").value("e1"))
                .andExpect(jsonPath("$[1]").value("e2"));
    }

    @Test
    void updateBookmark_shouldReturnOk_true_andPersistBookmark_whenNew() throws Exception {

        mockMvc.perform(put("/api/bookmarks/1/e1"))
                .andExpect(status().isOk())
                .andExpect(content().string("true"));

        mockMvc.perform(get("/api/bookmarks/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0]").value("e1"));
    }

    @Test
    void updateBookmark_shouldReturnConflict_whenAlreadyBookmarked() throws Exception {
        bookmarkContainerRepository.deleteAll();
        bookmarkContainerRepository.save(new BookmarkContainer("1", new java.util.ArrayList<>(List.of("e1"))));

        mockMvc.perform(put("/api/bookmarks/1/e1"))
                .andExpect(status().isConflict());
    }

    @Test
    void deleteBookmark_shouldReturnOk_true_andDeleteContainer_whenLastBookmarkRemoved() throws Exception {

        bookmarkContainerRepository.save(new BookmarkContainer("1", new java.util.ArrayList<>(List.of("e1"))));

        mockMvc.perform(delete("/api/bookmarks/1/e1"))
                .andExpect(status().isOk())
                .andExpect(content().string("true"));

        mockMvc.perform(get("/api/bookmarks/1"))
                .andExpect(status().isOk())
                .andExpect(content().json("[]"));
    }

    @Test
    void deleteBookmark_shouldReturnOk_true_whenRemovingNonExistingId_butKeepsOtherBookmarks() throws Exception {

        bookmarkContainerRepository.save(new BookmarkContainer("1", new java.util.ArrayList<>(List.of("e1", "e2"))));

        mockMvc.perform(delete("/api/bookmarks/1/e999"))
                .andExpect(status().isOk())
                .andExpect(content().string("true"));

        mockMvc.perform(get("/api/bookmarks/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0]").value("e1"))
                .andExpect(jsonPath("$[1]").value("e2"));
    }

    @Test
    void deleteBookmark_shouldReturnServerError_whenUserHasNoBookmarkDoc() throws Exception {
        mockMvc.perform(delete("/api/bookmarks/1/e1"))
                .andExpect(status().isNotFound());
    }
}