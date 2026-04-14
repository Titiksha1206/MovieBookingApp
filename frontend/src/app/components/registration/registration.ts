import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  standalone: false,
  templateUrl: './registration.html',
  styleUrl: './registration.css',
})
export class Registration implements OnInit{
  form! : FormGroup;
  constructor(private builder : FormBuilder,
     private authSevice : AuthService,
     private router : Router){ }

  ngOnInit(): void {
    this.form = this.builder.group(
      {
        username :['', Validators.required],
        email : ['', [Validators.required, Validators.email]],
        password : ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword : ['', Validators.required],
        mobileNumber : ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
        userRole :['', Validators.required]
      }, {validator : this.passwordMatchValidator}
    );
  }

  get username() {
   return  this.form.get('username')!;
  }

  get email() {
    return  this.form.get('email')!;
   }

   get password() {
    return  this.form.get('password')!;
   }

   get confirmPassword() {
    return  this.form.get('confirmPassword')!;
   }

   get mobileNumber(){
    return  this.form.get('mobileNumber')!;
   }

   get role(){
    return  this.form.get('userRole')!;
   }

   passwordMatchValidator(form : FormGroup){
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if(password === confirmPassword) {
      if(confirmPassword.length>0)
      form.get('confirmPassword')?.setErrors(null);
     else
     form.get('confirmPassword')?.setErrors({required : true});
    } else {
        form.get('confirmPassword')?.setErrors({mismatch : true});
    }
   }

   register() {
     if(this.form.valid){
      this.authSevice.registerUser(this.form.value).subscribe( {
        next : (data) => {
         // this.toastr.success("Registration Successfull", "Success")
          this.router.navigate(['/login']);

        },
        error : (err) => {
          console.log(err);
          //this.toastr.error("Registration Failed", "Failed");
        }
      })
     }
   }


}
