package org.example.backend.security;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AppUserService {

    private final AppUserRepository appUserRepository;

    public AppUser getMe(String id) {
        return appUserRepository.findById(id).orElse(null);
    }
}
