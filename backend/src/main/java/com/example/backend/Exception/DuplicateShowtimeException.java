package com.example.backend.Exception;

public class DuplicateShowtimeException extends RuntimeException {
    public DuplicateShowtimeException(String message) {
        super(message);
    }
    
}
