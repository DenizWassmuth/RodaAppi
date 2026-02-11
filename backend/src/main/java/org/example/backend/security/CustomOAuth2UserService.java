package org.example.backend.security;


import lombok.RequiredArgsConstructor;
import org.example.backend.models.AppUser;
import org.example.backend.repositories.AppUserRepository;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final AppUserRepository appUserRepository;

    // lädt oder kreiert AppUser, ist nicht dazu da, um mit den AppUsern zu hantieren -> dafür eigenen Service
    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        appUserRepository.findById(oAuth2User.getName()).orElseGet(() -> createAppUser(oAuth2User));
        return oAuth2User;
    }

    private AppUser createAppUser(OAuth2User oAuth2User){
        AppUser newUser = AppUser.builder()
                .id(oAuth2User.getAttribute("id").toString()) // UserId von Github
                .username(oAuth2User.getAttribute("login"))
                .createdIds(new ArrayList<>())
                .bookmarkedIds(new ArrayList<>())
                .build();
       appUserRepository.save(newUser); // save ist nicht immer schnell genug
       return newUser;
    }
}
