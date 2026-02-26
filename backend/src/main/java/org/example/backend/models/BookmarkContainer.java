package org.example.backend.models;


import lombok.With;
import org.springframework.data.annotation.Id;

import java.util.List;

@With
// id will be equal to the owners id
public record BookmarkContainer(@Id String id, List<String> bookmarkedIds) {
}
