package org.example.backend.models;


import lombok.With;

import java.util.List;

@With
// id will be equal to the owners id
public record BookMarkedEvents(String id, List<String> bookmarkedIds) {
}
