package com.example.backend.Controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.Configuration.JwtUtils;
import com.example.backend.Entity.LoginAuthenticationDto;
import com.example.backend.Entity.RegisterDto;
import com.example.backend.Entity.User;
import com.example.backend.Entity.UserDto;
import com.example.backend.Service.UserService;

@RestController
@RequestMapping("/api/user")
public class UserController {
  private final UserService userService;
  private final AuthenticationManager manager;
  private final JwtUtils jwtUtils;
  private final UserDetailsService userDetailsService;

    public UserController(UserService userService,
                          AuthenticationManager manager,
                          JwtUtils jwtUtils,
                          UserDetailsService userDetailsService) {
        this.userService = userService;
        this.manager = manager;
        this.jwtUtils = jwtUtils;
        this.userDetailsService = userDetailsService;
    }
    
 // 🔍 Flow:
 // Client sends:
 // {
 //   "username": "abc",
 //   "password": "123"
 // }
 // Controller receives
 // Calls service
 // Password encoded (BCrypt)
 // Saved in DB
    @PostMapping("/register")
    public ResponseEntity<User> addUser(@RequestBody RegisterDto userDto){
        User user = new User();
        user.setUsername(userDto.getUsername());
        user.setEmail(userDto.getEmail());
        user.setPassword(userDto.getPassword());
        user.setMobileNumber(userDto.getMobileNumber());
        user.setUserRole(userDto.getUserRole());
        return ResponseEntity.status(201).body(userService.registerUser(user));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserDto userDto){
        
      // 👉 Spring internally:
                              //fetches user
                              //compares password (BCrypt)
                              //throws exception if wrong
      Authentication authentication = manager.authenticate(new UsernamePasswordAuthenticationToken(
        userDto.getUsername(),
        userDto.getPassword()
      ));

      // 👉 Loads user again (for token generation)
      UserDetails userDetails = userDetailsService.loadUserByUsername(userDto.getUsername());

      if(authentication.isAuthenticated()) { // 👉 If authentication successful, generate token and return user details
        User user = userService.findByUsername(userDto.getUsername());
        LoginAuthenticationDto data = new LoginAuthenticationDto();
        data.setToken(jwtUtils.generateToken(userDetails));
        data.setUsername(user.getUsername());
        data.setUserRole(user.getUserRole());
        data.setUserId(user.getUserId());
        return ResponseEntity.status(200).body(data);
      }
      else
        return ResponseEntity.status(404).body("Not Found");
    }


    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
      return ResponseEntity.ok(userService.getAllUser());
    }
}
