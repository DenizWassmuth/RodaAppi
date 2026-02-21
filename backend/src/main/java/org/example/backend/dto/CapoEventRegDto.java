package org.example.backend.dto;

import lombok.With;
import org.example.backend.data.LocationData;
import org.example.backend.enums.CapoEventEnumType;
import org.example.backend.enums.RepetitionRhythmEnumType;

import java.time.LocalDateTime;

@With
public record CapoEventRegDto(
        String userId,
        String userName,
        String eventTitle,
        String eventDescription,
        String thumbnail,
        LocationData locationData,
        LocalDateTime eventStart,
        LocalDateTime eventEnd,
        CapoEventEnumType eventType,
        RepetitionRhythmEnumType repRhythm,
        LocalDateTime repUntil) {
}
