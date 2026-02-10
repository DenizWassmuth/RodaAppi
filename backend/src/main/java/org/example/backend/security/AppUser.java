package org.example.backend.security;

import lombok.Builder;

@Builder
public record AppUser(String id, String username) {
}
