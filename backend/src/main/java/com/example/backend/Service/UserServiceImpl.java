package com.example.backend.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.backend.Configuration.UserPrinciple;
import com.example.backend.Entity.User;
import com.example.backend.Repository.UserRepo;

@Service
public class UserServiceImpl implements UserService, UserDetailsService {
     @Autowired
    UserRepo userRepo;

    @Override
    public User registerUser(User user) {
       user.setPassword(new BCryptPasswordEncoder().encode(user.getPassword()));
       return userRepo.save(user);
    }

    @Override
    public List<User> getAllUser() {
       return userRepo.findAll();
    }

    @Override
    public User loginUser(User user) {
       return userRepo.findById(user.getUserId()).orElse(null);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
      
        User user = userRepo.findByUsername(username);

        if(user == null) throw new UsernameNotFoundException("Not Found");

        return new UserPrinciple(user);
    }

    @Override
    public User findByUsername(String username) {
      return userRepo.findByUsername(username);
    }



}
