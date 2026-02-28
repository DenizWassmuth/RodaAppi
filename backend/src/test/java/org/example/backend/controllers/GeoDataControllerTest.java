package org.example.backend.controllers;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.restclient.test.autoconfigure.AutoConfigureMockRestServiceServer;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import static org.springframework.test.web.client.match.MockRestRequestMatchers.*;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

@SpringBootTest(properties = {"rapidapi.csc.host=fakehost.com", "rapidapi.csc.key=fakeKey"})
@AutoConfigureMockMvc
@AutoConfigureMockRestServiceServer

class GeoDataControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private MockRestServiceServer mockServer;

    @Test
    void getCountries_shouldReturnListWithOneCountry_whenCalled() throws Exception {

        // GIVEN
        mockServer.expect(requestTo("https://country-state-city-search-rest-api.p.rapidapi.com/allcountries"))
                .andExpect(method(HttpMethod.GET))
                .andRespond(withSuccess(
                        """
                                [
                                    {
                                        "name":"Afghanistan",
                                        "isoCode":"AF"
                                    }
                                ]
                                """, MediaType.APPLICATION_JSON));

        mockMvc.perform(MockMvcRequestBuilders.get("/api/geodata/countries"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().json(
                        """
                                        [
                                          {
                                           "name":"Afghanistan",
                                           "isoCode":"AF"
                                          }
                                        ]
                                """
                ));

    }

    @Test
    void getCountries_shouldReturnEmptyList_whenCalled() throws Exception {

        // GIVEN
        mockServer.expect(requestTo("https://country-state-city-search-rest-api.p.rapidapi.com/allcountries"))
                .andExpect(method(HttpMethod.GET))
                .andRespond(withSuccess(
                        """
                                [
                                ]
                                """, MediaType.APPLICATION_JSON));

        mockMvc.perform(MockMvcRequestBuilders.get("/api/geodata/countries"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().json(
                        """
                                        [
                                        ]
                                """
                ));

    }

    @Test
    void getStates_shouldReturnListWithOneState_whenCalled() throws Exception {

        // GIVEN
        mockServer.expect(requestTo("https://country-state-city-search-rest-api.p.rapidapi.com/states-by-countrycode?countrycode=us"))
                .andExpect(method(HttpMethod.GET))
                .andRespond(withSuccess(
                        """
                                [
                                    {
                                       "name":"Alabama",
                                       "isoCode":"AL"
                                    }
                                ]
                                """, MediaType.APPLICATION_JSON));

        mockMvc.perform(MockMvcRequestBuilders.get("/api/geodata/states")
                        .param("countryCode", "us"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().json(
                        """
                                        [
                                          {
                                            "name":"Alabama",
                                            "isoCode":"AL"
                                          }
                                        ]
                                """
                ));
    }

    @Test
    void getStates_shouldReturnEmptyList_whenCalled() throws Exception {

        // GIVEN
        mockServer.expect(requestTo("https://country-state-city-search-rest-api.p.rapidapi.com/states-by-countrycode?countrycode=us"))
                .andExpect(method(HttpMethod.GET))
                .andRespond(withSuccess(
                        """
                                [
                                ]
                                """, MediaType.APPLICATION_JSON));

        mockMvc.perform(MockMvcRequestBuilders.get("/api/geodata/states")
                        .param("countryCode", "us"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().json(
                        """
                                        [
                                        ]
                                """
                ));
    }

    @Test
    void getCities_shouldReturnListWithOneCity_whenCalled() throws Exception {

        // GIVEN
        mockServer.expect(requestTo("https://country-state-city-search-rest-api.p.rapidapi.com/cities-by-countrycode-and-statecode?countrycode=us&statecode=fl"))
                .andExpect(method(HttpMethod.GET))
                .andRespond(withSuccess(
                        """
                                [
                                    {
                                       "name":"Aberdeen"
                                    }
                                ]
                                """, MediaType.APPLICATION_JSON));

        mockMvc.perform(MockMvcRequestBuilders.get("/api/geodata/cities")
                        .param("countryCode", "us").param("stateCode", "fl"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().json(
                        """
                                        [
                                          {
                                            "name":"Aberdeen"
                                          }
                                        ]
                                """
                ));
    }

    @Test
    void getCities_shouldReturnEmptyList_whenCalled() throws Exception {

        // GIVEN
        mockServer.expect(requestTo("https://country-state-city-search-rest-api.p.rapidapi.com/cities-by-countrycode-and-statecode?countrycode=us&statecode=fl"))
                .andExpect(method(HttpMethod.GET))
                .andRespond(withSuccess(
                        """
                                [
                                ]
                                """, MediaType.APPLICATION_JSON));

        mockMvc.perform(MockMvcRequestBuilders.get("/api/geodata/cities")
                        .param("countryCode", "us").param("stateCode", "fl"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().json(
                        """
                                        [
                                        ]
                                """
                ));
    }
}