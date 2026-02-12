package org.example.backend.enums;

public enum RepetitionRhythmEnumType {
    ONCE("once"),
    DAILY("daily"),
    WEEKLY("weekly"),
    MONTHLY("monthly"),
    QUARTERLY("quarterly"),
    YEARLY("yearly"),
    CUSTOM("custom");

    private final String literal;
    RepetitionRhythmEnumType(String literal) {
        this.literal = literal;
    }
}
