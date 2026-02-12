package org.example.backend.models;

import lombok.With;
import org.example.backend.enums.CapoEventType;
import org.example.backend.enums.RepetitionRhythm;
import org.springframework.data.mongodb.core.mapping.Document;


import java.time.LocalDateTime;

@With
@Document(collection = "capoevent")
public record CapoEvent(
        String id,
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
