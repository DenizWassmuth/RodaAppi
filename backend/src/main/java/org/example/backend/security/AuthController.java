package org.example.backend.security;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AppUserService appUserService;

    public AuthController(AppUserService appUserService) {
        this.appUserService = appUserService;
    }

    // TODO: umbauen um AppUser zurückzugeben, hier und im Frontend
    @GetMapping
    public AppUser getMe(@AuthenticationPrincipal OAuth2User user){

        if(user == null){
            throw new IllegalArgumentException("user is null");
        }

        return appUserService.getMe(user.getAttribute("id").toString());
    }
}
