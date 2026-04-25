package com.example.backend.Entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class MovieDto {
    private String title;
    private int duration;
    private String genre;
    private int price;
    private String language;
    private String cbfc; 
    private String imageUrl;
}
