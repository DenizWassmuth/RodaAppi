package org.example.backend.enums;

public enum CapoEventType {
    RODA("Roda"),
    WORKSHOP("Workshop"),;

    private final String literal;

    CapoEventType(String literal) {
        this.literal = literal;
    }
}
