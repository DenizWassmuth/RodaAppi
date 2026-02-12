package org.example.backend.dto;

import lombok.With;
import org.example.backend.enums.CapoEventEnumType;
import org.example.backend.enums.RepetitionRhythmEnumType;

import java.time.LocalDateTime;

@With
public record CapoEventRegDto(
        String creatorName,
        String eventTitle,
        String eventDescription,
        String thumbnail,
        String eventLocation,
        String street,
        LocalDateTime eventStart,
        LocalDateTime eventEnd,
        CapoEventEnumType eventType,
        RepetitionRhythmEnumType repRhythm) {
}
