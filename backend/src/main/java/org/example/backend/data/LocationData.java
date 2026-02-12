package org.example.backend.data;

import lombok.With;

@With
public record LocationData(String country, String state, String city, String street, String streetNumber, String specifics) {
}
