package org.example.backend.security;

import lombok.Builder;

import java.util.List;

@Builder
public record AppUser(String id, String username, List<String> createdIds, List<String> bookmarkedIds) {
}
