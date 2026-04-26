package com.example.backend.Service;

import java.util.List;

import com.example.backend.Entity.User;

public interface UserService {
    User registerUser(User user);
    List<User> getAllUser();
    User findByUsername(String username);
}
