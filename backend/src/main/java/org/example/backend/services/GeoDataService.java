package org.example.backend.services;


import org.example.backend.data.CountryData;
import org.example.backend.dto.CountryDto;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;


import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class GeoDataService {

    private final RestClient restClient;
    public GeoDataService(RestClient.Builder restClientBuilder) {
        this.restClient = restClientBuilder
                .baseUrl("https://country-state-city-search-rest-api.p.rapidapi.com")
                .build();
    }

    public List<CountryDto> getCountries() {

        CountryData[] countries = restClient.get()
                .uri("/allcountries")
                .retrieve()
                .body(CountryData[].class);

        if (countries == null) {
            return new ArrayList<>();
        }

        return Arrays.stream(countries).map((c)-> new CountryDto(c.name(),c.isoCode())).toList();
    }
}
