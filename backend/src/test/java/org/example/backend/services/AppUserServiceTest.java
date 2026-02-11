package org.example.backend.services;

import org.example.backend.models.AppUser;
import org.example.backend.repositories.AppUserRepository;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

class AppUserServiceTest {

    AppUserRepository appUserRepository = Mockito.mock(AppUserRepository.class);
    AppUserService appUserService = new AppUserService(appUserRepository);

    AppUser testUser1 = new AppUser("1", "chiko", List.of("2"), List.of("3"));


    @Test
    void getMe_shouldReturnNull() {

        when(appUserRepository.findById("0")).thenReturn(Optional.empty());

        AppUser expectedUser = appUserService.getMe("0");

        assertNull(expectedUser);
    }

    @Test
    void getMe_shouldReturnGivenAppUser() {

        AppUser givenUser = testUser1;
        when(appUserRepository.findById("1")).thenReturn(Optional.of(givenUser));

        AppUser expectedUser = appUserService.getMe("1");

        assertNotNull(expectedUser);
        assertEquals(expectedUser, givenUser);
    }
}