package org.example.backend.enums;

public enum RepetitionRhythm {
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

//    public String literal() {
//        return literal;
//    }

    public static RepetitionRhythm getFromLiteral(String raw) {
        if (raw == null) return null;
        String normalized = raw.trim().toLowerCase();

        for (RepetitionRhythm repRhythm : values()) {
            String literalNormalized = repRhythm.literal.trim().toLowerCase();
            if (literalNormalized.equals(normalized)) {
                return repRhythm;
            }
        }

        throw new IllegalArgumentException("Unknown RepetitionRhythm: " + raw);
    }
}
