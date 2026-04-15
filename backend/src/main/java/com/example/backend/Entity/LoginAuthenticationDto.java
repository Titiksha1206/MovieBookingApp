package com.example.backend.Entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter

public class LoginAuthenticationDto {
   private String token;
   private String username;
   private String userRole;
   private int userId;
}
