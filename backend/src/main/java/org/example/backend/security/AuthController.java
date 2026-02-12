package org.example.backend.security;

import org.example.backend.models.AppUser;
import org.example.backend.services.AppUserService;
import org.springframework.http.ResponseEntity;
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

    @GetMapping
    public ResponseEntity<AppUser> getMe(@AuthenticationPrincipal OAuth2User user) {

        if(user == null){
            return ResponseEntity.badRequest().build();
        }

        if(user.getAttribute("id") == null){
            return ResponseEntity.badRequest().build();
        }

        AppUser foundUser = appUserService.getMe(user.getAttribute("id").toString());
        if(foundUser == null){
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(foundUser);
    }
}
