package org.example.backend.dto;

import lombok.With;
import org.example.backend.enums.CapoEventType;
import org.example.backend.enums.RepetitionRhythm;

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
        CapoEventType eventType,
        RepetitionRhythm repRhythm) {
}
