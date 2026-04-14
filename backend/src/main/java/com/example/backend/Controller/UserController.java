package com.example.backend.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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
import com.example.backend.Entity.User;
import com.example.backend.Entity.UserDto;
import com.example.backend.Service.UserService;

@RestController
@RequestMapping("/api/user")

public class UserController {
    @Autowired
    UserService userService;

    @Autowired
    AuthenticationManager manager;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    UserDetailsService userDetailsService;
    
    @PostMapping("/register")
    public ResponseEntity<User> addUser(@RequestBody User user){
        return ResponseEntity.status(201).body(userService.registerUser(user));
    }

    @PostMapping("/login")
     public ResponseEntity<?> login(@RequestBody UserDto userDto){
         
        Authentication authentication = manager.authenticate(new UsernamePasswordAuthenticationToken(userDto.getUsername(), userDto.getPassword())) ;
        UserDetails userDetails = userDetailsService.loadUserByUsername(userDto.getUsername());

        if(authentication.isAuthenticated())  {
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
     public List<User> getAllUsers() {
        return userService.getAllUser();
     }
}
