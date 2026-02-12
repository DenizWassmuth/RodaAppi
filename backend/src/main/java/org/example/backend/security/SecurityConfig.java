package org.example.backend.security;


import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) {
        http
                // vorerst abschalten damit keine Konflikte mit POST/PUT entstehen
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(a -> a
                        .requestMatchers("/api/auth").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/capoevent").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/capoevent/*").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/capoevent").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/capoevent/*").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/capoevent/*").authenticated()
//                        .requestMatchers(HttpMethod.GET, "/api/users").hasAuthority("ADMIN")
                        .anyRequest().permitAll()) // am Ende alles auf permitAll stellen, da es Hintergrundprozesse gibt die sonst blockiert werden
                .logout(l -> l.logoutSuccessUrl("http://localhost:5173"))
                .oauth2Login(o -> o
                        .defaultSuccessUrl("http://localhost:5173"));
        return http.build();
    }
}
