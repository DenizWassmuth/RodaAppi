package org.example.backend.models;

import lombok.With;
import org.example.backend.data.LocationData;
import org.example.backend.enums.CapoEventEnumType;
import org.example.backend.enums.RepetitionRhythmEnumType;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;


import java.time.LocalDateTime;

@With
@Document(collection = "capoevent")
public record CapoEvent(
        @Id String  id,
        String creatorId,
        String seriesId,
        int occurrenceIndex,
        String creatorName,
        String eventTitle,
        String eventDescription,
        String thumbnail,
        LocationData locationData,
        LocalDateTime eventStart,
        LocalDateTime eventEnd,
        CapoEventEnumType eventType,
        RepetitionRhythmEnumType repRhythm
        ) {
}
