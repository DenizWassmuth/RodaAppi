package org.example.backend.models;

import lombok.Builder;

import java.util.List;

@Builder
public record AppUser(String id, String username, List<String> createdIds, List<String> bookmarkedIds) {
}
