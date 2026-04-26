import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
isLoggedIn: boolean = false;

ngOnInit() {
  this.checkLogin();
}

checkLogin() {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    this.isLoggedIn = !!token;
  } else {
    this.isLoggedIn = false;
  }
}
}
