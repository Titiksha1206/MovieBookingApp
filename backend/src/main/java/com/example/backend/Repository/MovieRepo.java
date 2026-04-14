package com.example.backend.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.backend.Entity.Movie;

@Repository
public interface MovieRepo extends JpaRepository<Movie, Long> {
    
}
