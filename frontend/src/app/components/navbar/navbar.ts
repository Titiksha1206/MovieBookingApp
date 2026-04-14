import { Component } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
   isLoggedIn: boolean = false;
  userName : string = "John Doe";
  userRole : string = "ADMIN";
  showLogoutPopup: boolean = false;

  constructor(private router : Router, private authService : AuthService) { }
  
  ngOnInit(): void {
     this.authService.user$.subscribe(user => {
      if(user != null) {
        this.isLoggedIn = true;
        this.userName = user.username;
        this.userRole = user.userRole;
      } else {
        this.isLoggedIn = false;
      }
     })
  }

  logout() {
     localStorage.removeItem('token');
     localStorage.removeItem('username');
     localStorage.removeItem('userRole');
     localStorage.removeItem('userId');
     this.authService.setUser(null);
     //this.toastr.success("Logout Successfull", "Success");
     this.router.navigate(["/"]);

  }

}
