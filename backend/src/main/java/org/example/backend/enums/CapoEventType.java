package org.example.backend.enums;

public enum CapoEventType {
    RODA("Roda"),
    WORKSHOP("Workshop"),;

    private final String literal;

    CapoEventType(String literal) {
        this.literal = literal;
    }

    public String literal() {
        return literal;
    }

    public static CapoEventType fromLiteral(String raw) {
        if (raw == null) return null;
        String normalized = raw.trim().toLowerCase();

        for (CapoEventType eventType : values()) {
            String literalNormalized = eventType.literal.trim().toLowerCase();
            if (literalNormalized.equals(normalized)) {
                return eventType;
            }
        }

        throw new IllegalArgumentException("Unknown CapoEventType: " + raw);
    }
}
