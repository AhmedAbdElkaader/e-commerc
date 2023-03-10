import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RestService } from 'src/app/services/rest.service';
import { Router } from '@angular/router';
import {
  SocialAuthService,
  FacebookLoginProvider,
  SocialUser,
} from 'angularx-social-login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private rest :RestService ,
    private socialAuthService: SocialAuthService,
     private route : Router){}

  loginForm: FormGroup | any;
  socialUser!: SocialUser;
  ngOnInit(){
    this.loginForm = new FormGroup({
      email: new FormControl("", [Validators.required,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
      password: new FormControl("", [Validators.required]),
    })

    this.socialAuthService.authState.subscribe((user:any) => {
      this.socialUser = user;
    });
  }

  login(){
    let form = this.loginForm.value
    if(this.loginForm.valid){
      this.rest.login(form).subscribe((res :any) => {
        console.log(res)
        localStorage.setItem("token",res.access_token)
        localStorage.setItem("user",res.user.email)
        localStorage.setItem("clientID",res.user.id)
        this.rest.succesToast("Login Successfully")
        this.rest.SendDataIfLogin("true")
        this.route.navigateByUrl("/home")
      }, (err : any) => {
        this.rest.erorrToaster("Pleas check Email Or Password")
      })
    }
  }
  loginWithFacebook(): void {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

}
