package com.example.usersmicroservice.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutHandler;

import static com.example.usersmicroservice.model.Permission.*;
import static com.example.usersmicroservice.model.Role.MANAGER;
import static com.example.usersmicroservice.model.Role.USER;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableMethodSecurity
public class SecurityConfig {

    private static final String[] WHITELIST_URL = {
            "/api/v1/auth/**"
    };

    private final JwtAuthFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;
    private final LogoutHandler logoutHandler;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(request ->
                        request.requestMatchers(WHITELIST_URL)
                                .permitAll()
                                .requestMatchers("/api/v1/users/**").hasAnyRole(MANAGER.name(), USER.name())
                                .requestMatchers(HttpMethod.POST, "/api/v1/users/**").hasAnyAuthority(MANAGER_CREATE.name())
                                .requestMatchers(HttpMethod.GET, "/api/v1/users/**").hasAnyAuthority(MANAGER_READ.name(), USER_READ.name())
                                .requestMatchers(HttpMethod.PATCH, "/api/v1/users/**").hasAnyAuthority(MANAGER_UPDATE.name())
                                .requestMatchers(HttpMethod.DELETE, "/api/v1/users/**").hasAnyAuthority(MANAGER_DELETE.name())
                                .anyRequest().authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .logout(logout ->
                        logout.logoutUrl("/api/v1/auth/logout")
                                .addLogoutHandler(logoutHandler)
                                .logoutSuccessHandler((request, response, authentication) -> SecurityContextHolder.clearContext())
                )
                .cors(httpSecurityCorsConfigurer -> httpSecurityCorsConfigurer.configure(http));

        return http.build();
    }
}
