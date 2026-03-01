package org.example.backend.dto;

import org.example.backend.enums.CapoEventEnumType;

import java.time.LocalDateTime;

public record CapoEventFilterDto(
        String country,
        String state,
        String city,
        CapoEventEnumType eventType,
        LocalDateTime startsAfter,
        LocalDateTime startsBefore,
        boolean upcomingOnly) {
}
