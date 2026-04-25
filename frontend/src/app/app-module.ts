import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Adminaddmovie } from './components/adminaddmovie/adminaddmovie';
import { Adminviewbooking } from './components/adminviewbooking/adminviewbooking';
import { Adminviewmovie } from './components/adminviewmovie/adminviewmovie';
import { Home } from './components/home/home';
import { Login } from './components/login/login';
import { Registration } from './components/registration/registration';
import { Userbookingmovie } from './components/userbookingmovie/userbookingmovie';
import { Userviewbooking } from './components/userviewbooking/userviewbooking';
import { Userviewmovie } from './components/userviewmovie/userviewmovie';
import { Navbar } from './components/navbar/navbar';
import { Usernav } from './components/usernav/usernav';
import { Adminnav } from './components/adminnav/adminnav';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DurationPipe } from './pipes/duration-pipe';

@NgModule({
  declarations: [
    App,
    Adminaddmovie,
    Adminviewbooking,
    Adminviewmovie,
    Home,
    Login,
    Registration,
    Userbookingmovie,
    Userviewbooking,
    Userviewmovie,
    Navbar,
    Usernav,
    Adminnav,
    DurationPipe,
  ],
  imports: [BrowserModule, ReactiveFormsModule, FormsModule, AppRoutingModule],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch()),
  ],
  bootstrap: [App],
})
export class AppModule {}
