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

const routes: Routes = [
  {path:'', component : Home},
  {path:'register', component:Registration},
  {path:'login', component:Login},
  {path:'admin/add/newMovies', component:Adminaddmovie},
  {path:'admin/view/Movies' , component: Adminviewmovie},
  {path:'admin/view/AllBookings', component: Adminviewbooking, canActivate:[adminGuard]},
  {path:'user/view/Movies', component: Userviewmovie, canActivate:[userGuard]},
  {path:'user/bookMovie', component: Userbookingmovie, canActivate:[userGuard] },
  {path:'user/view/Mybookings', component: Userviewbooking},
  { path: 'admin/manage', component: Adminmanage }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
