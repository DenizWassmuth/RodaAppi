package org.example.backend.models;

import lombok.Builder;
import org.springframework.data.annotation.Id;

import java.util.List;

@Builder
public record AppUser(@Id String id, String username, List<String> createdIds, List<String> bookmarkedIds) {
}
