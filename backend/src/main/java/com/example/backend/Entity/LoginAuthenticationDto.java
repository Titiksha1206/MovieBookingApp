package com.example.backend.Entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class LoginAuthenticationDto {
   private String token;
   private String username;
   private String userRole;
   private int userId;
}
