package com.example.backend.Exception;

public class InsufficientSeatCountException extends RuntimeException {
    public InsufficientSeatCountException(String message) {
        super(message);
    }
    
}
