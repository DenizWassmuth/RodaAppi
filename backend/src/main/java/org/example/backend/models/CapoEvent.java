package org.example.backend.models;

import lombok.With;
import org.example.backend.enums.CapoEventType;
import org.example.backend.enums.RepetitionRhythm;

import java.awt.*;
import java.time.LocalDateTime;

@With
public record CapoEvent(
        String eventId,
        String creatorId,
        String creatorName,
        String eventTitle,
        String eventDescription,
        String thumbnail,
        String eventLocation,
        String street,
        LocalDateTime eventStart,
        LocalDateTime eventEnd,
        CapoEventType eventType,
        RepetitionRhythm repRhythm
        ) {
}
