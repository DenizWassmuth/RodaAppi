package org.example.backend.enums;

public enum RepetitionRhythm {
    ONCE("once"),
    DAILY("daily"),
    WEEKLY("weekly"),
    MONTHLY("monthly"),
    QUARTERLY("quarterly"),
    YEARLY("yearly"),
    CUSTOM("custom");

    private final String literal;
    RepetitionRhythm(String literal) {
        this.literal = literal;
    }
}
