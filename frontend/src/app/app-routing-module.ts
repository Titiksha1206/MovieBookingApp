import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Registration } from './components/registration/registration';
import { Login } from './components/login/login';
import { Adminaddmovie } from './components/adminaddmovie/adminaddmovie';
import { Adminviewmovie } from './components/adminviewmovie/adminviewmovie';
import { Adminviewbooking } from './components/adminviewbooking/adminviewbooking';
import { Userviewmovie } from './components/userviewmovie/userviewmovie';
import { Userbookingmovie } from './components/userbookingmovie/userbookingmovie';
import { Userviewbooking } from './components/userviewbooking/userviewbooking';
import { adminGuard } from './guards/admin-guard';
import { userGuard } from './guards/user-guard';
import { Adminmanage } from './components/adminmanage/adminmanage';
import { Userseatselection } from './components/userseatselection/userseatselection';

const routes: Routes = [
  { path: '', component: Home },
  { path: 'register', component: Registration },
  { path: 'login', component: Login },
  { path: 'admin/add/newMovies', component: Adminaddmovie, canActivate: [adminGuard] },
  { path: 'admin/view/Movies', component: Adminviewmovie, canActivate: [adminGuard] },
  { path: 'admin/view/AllBookings', component: Adminviewbooking, canActivate: [adminGuard] },
  { path: 'user/view/Movies', component: Userviewmovie },
  { path: 'user/bookMovie', component: Userbookingmovie },
  { path: 'user/view/Mybookings', component: Userviewbooking, canActivate: [userGuard] },
  { path: 'user/selectSeats', component: Userseatselection },
  { path: 'admin/manage', component: Adminmanage, canActivate: [adminGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
