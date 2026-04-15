package com.example.backend.Service;

import java.util.List;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.backend.Configuration.UserPrinciple;
import com.example.backend.Entity.User;
import com.example.backend.Exception.UserNotFoundException;
import com.example.backend.Repository.UserRepo;

@Service
public class UserServiceImpl implements UserService, UserDetailsService {

   UserRepo userRepo;

   public UserServiceImpl(UserRepo userRepo) {
      this.userRepo = userRepo;
   }

   @Override
   public User registerUser(User user) {
      if(userRepo.findByUsername(user.getUsername()) != null){
         throw new RuntimeException("Username already exists");
      }

      user.setPassword(new BCryptPasswordEncoder().encode(user.getPassword()));
      return userRepo.save(user);
   }

   @Override
   public List<User> getAllUser() {
      return userRepo.findAll();
   }

   // @Override
   // public User loginUser(User user) {
   //    return userRepo.findById(user.getUserId()).orElse(null);
   // }

   @Override
   public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
   
      User user = userRepo.findByUsername(username);

      if(user == null) throw new UsernameNotFoundException("User not found with username: " + username);

      return new UserPrinciple(user);
   }

   @Override
   public User findByUsername(String username) {
   User user = userRepo.findByUsername(username);

      if(user == null){
         throw new UserNotFoundException("User not found with username: " + username);
      }
      return user;
   }
}
