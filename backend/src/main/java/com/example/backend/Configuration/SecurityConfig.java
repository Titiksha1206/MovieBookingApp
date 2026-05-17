package com.example.backend.Configuration;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    UserDetailsService userDetailsService; 

    @Autowired
    JwtAuthenticationFilter jwtFilter;

@Bean
AuthenticationProvider authenticationProvider() {
    DaoAuthenticationProvider provider = new DaoAuthenticationProvider(userDetailsService);
    provider.setPasswordEncoder(new BCryptPasswordEncoder());
    return provider;
}

@Bean
SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{
      return http.csrf( csrf -> csrf.disable())
                 .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                 .authorizeHttpRequests(auth -> auth
                 .requestMatchers("/api/user/register", "/api/user/login").permitAll()
                 .anyRequest().permitAll())
                 .sessionManagement(session -> session
                 .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                 .httpBasic(Customizer.withDefaults())
                 .formLogin(form -> form.disable())
                 .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                 .build();
} 

 @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList(
            System.getenv().getOrDefault("CORS_ALLOWED_ORIGINS", "http://localhost:4200,https://snematix-frontend.vercel.app").split(",")
        ));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.setExposedHeaders(Arrays.asList("Authorization"));
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
         source.registerCorsConfiguration("/**", configuration);
        return source;
    }
@Bean
   AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
    return config.getAuthenticationManager();
}

}
