package org.example.backend.services;

import lombok.RequiredArgsConstructor;
import org.example.backend.models.AppUser;
import org.example.backend.repositories.AppUserRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AppUserService {

    private final AppUserRepository appUserRepository;

    public AppUser getMe(String id) {
        return appUserRepository.findById(id).orElse(null);
    }
}
