package org.example.backend.dto;

import lombok.With;

@With
public record PartOfSeriesDto(boolean isPartOfSeries, boolean hasBefore, boolean hasAfter) {
}
