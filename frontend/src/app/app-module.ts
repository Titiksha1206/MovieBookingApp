import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch } from '@angular/common/http';
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
import { Adminmanage } from './components/adminmanage/adminmanage';
import { Userseatselection } from './components/userseatselection/userseatselection';
import { NotificationComponent } from './components/notification-component/notification-component';
import { NotificationService } from './services/notification-service';
import { AuthInterceptor } from './interceptors/auth.interceptor';

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
    Adminmanage,
    Userseatselection,
    NotificationComponent,
  ],
  imports: [BrowserModule, ReactiveFormsModule, FormsModule, AppRoutingModule],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withFetch()),
    NotificationService,
    {
      provide: HTTP_INTERCEPTORS,      // ✅ Register the interceptor
      useClass: AuthInterceptor,
      multi: true                      // ✅ Allow multiple interceptors
    }
  ],
  bootstrap: [App],
})
export class AppModule {}
