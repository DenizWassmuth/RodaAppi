package org.example.backend.enums;

public enum CapoEventEnumType {
    RODA("Roda"),
    WORKSHOP("Workshop"),;

    private final String literal;

    CapoEventEnumType(String literal) {
        this.literal = literal;
    }
}
