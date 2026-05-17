package com.example.backend.Configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebMvc
public class CrosConfig implements WebMvcConfigurer {
     @Override
    public void addCorsMappings(CorsRegistry registry) {
         registry.addMapping("/**")
                  .allowedOrigins(System.getenv().getOrDefault("CORS_ALLOWED_ORIGINS", "http://localhost:4200,https://snematix-frontend.vercel.app").split(","))
                  .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                  .allowedHeaders("*");
    }

}
