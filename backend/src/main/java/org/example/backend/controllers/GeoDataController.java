package org.example.backend.controllers;


import org.example.backend.dto.CityDto;
import org.example.backend.dto.CountryDto;
import org.example.backend.dto.StateDto;
import org.example.backend.services.GeoDataService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/geodata")
public class GeoDataController {

    private final GeoDataService geoLookupService;

    public GeoDataController(GeoDataService geoLookupService) {
        this.geoLookupService = geoLookupService;
    }

    @GetMapping("/countries")
    public List<CountryDto> getCountries() {
        return geoLookupService.getCountries();
    }

    @GetMapping("/states")
    public List<StateDto> getStates(@RequestParam String countryCode) {
        return geoLookupService.getStatesByCountryCode(countryCode);
    }

    @GetMapping("/cities")
    public List<CityDto> getCities(@RequestParam String countryCode, @RequestParam String stateCode) {
        return geoLookupService.getCitiesByCountryCodeAndStateCode(countryCode, stateCode);
    }
}