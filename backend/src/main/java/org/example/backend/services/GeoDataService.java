package org.example.backend.services;


import org.example.backend.data.CityData;
import org.example.backend.data.CountryData;
import org.example.backend.data.StateData;
import org.example.backend.dto.CityDto;
import org.example.backend.dto.CountryDto;
import org.example.backend.dto.StateDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;


import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class GeoDataService {



    private final RestClient restClient;
    public GeoDataService(RestClient.Builder restClientBuilder, @Value("${rapidapi.csc.host}") String host,
                          @Value("${rapidapi.csc.key}") String key) {
        this.restClient = restClientBuilder
                .baseUrl("https://country-state-city-search-rest-api.p.rapidapi.com")
                .defaultHeader("x-rapidapi-host", host)
                .defaultHeader("x-rapidapi-key", key)
                .defaultHeader(HttpHeaders.ACCEPT, "application/json")
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

    public List<StateDto> getStatesByCountryCode(String countryCode) {

        StateData[] states = restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/states-by-countrycode")
                        .queryParam("countrycode", countryCode)
                        .build())
                .retrieve()
                .body(StateData[].class);

        if (states == null) {
            return new ArrayList<>();
        }

        return Arrays.stream(states).map((s)-> new StateDto(s.name(),s.isoCode())).toList();
    }

    public List<CityDto> getCitiesByCountryCodeAndStateCode(String countryCode, String stateCode) {

        CityData[] cities = restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/cities-by-countrycode-and-statecode")
                        .queryParam("countrycode", countryCode)
                        .queryParam("statecode", stateCode)
                        .build())
                .retrieve()
                .body(CityData[].class);

        if (cities == null) {
            return new ArrayList<>();
        }

        return Arrays.stream(cities).map((c)-> new CityDto(c.name())).toList();
    }
}
