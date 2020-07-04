import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { validate } from 'json-schema';
import { StravaOauthService } from './services/strava-oauth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public errors = [];

  public userData = {
    email: "",
    password: "",
    username: "",
    rememberMe: false
  }

  public isLoggedIn : boolean = false;

  constructor(private authService: AuthService,
    private router: Router,
    private stravaOauth: StravaOauthService ){

      let base64str = localStorage.getItem("credentials");
      if(base64str != undefined){
        let credentials = atob(base64str).split(":");
        this.userData.email = credentials[0];
        this.userData.password = credentials[1];
        this.userData.rememberMe = true;
      }

      let location = window.location.href;
      if( location.includes("code=")){
        
        this.stravaTokenExchange();
      }

  }


  public registerUser() {
    this.authService.registerUser(this.userData)
      .subscribe(
        res => {
          console.log(res);
          this.closeModals();
          this.openLogin();
          this.errors = [];
        },
        err => this.errors = err.error
      )
  }

  public loginUser(user){

    if(user == undefined){
      user = this.userData;
    }

    this.authService.loginUser(user)
      .subscribe(
        res => {
          console.log(res);
          this.closeModals();
          localStorage.setItem('token', res.token);
          this.isLoggedIn = true;
          this.errors = [];
          this.router.navigate(['/dashboard']);
        },
        err => this.errors = [err.error] 
      )
  }

  openLogin() {
    setTimeout(() => {
      document.getElementById("login-modal").style.display = "block";
    }, 50);
  }

  openSingup() {

    if(this.isLoggedIn){
      this.isLoggedIn = false;
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
      return;
    }

    setTimeout(() => {
      document.getElementById("signup-modal").style.display = "block";
    }, 50);
  }

  closeModals() {
    document.getElementById("signup-modal").style.display = "none";
    document.getElementById("login-modal").style.display = "none";
  }

  loginClicked(type) {

    if (type == "facebook") {
      alert("not yet implemented!");
      return;
    }

    if (type == "strava") {
      this.stravaOauth.startOauthFlow();
      return;
    }

    if (type == "email") {
    
      this.validateForm();
      if(this.errors.length > 0){ return; }

      if(this.userData.rememberMe){
        let credentials = this.userData.email + ":" + this.userData.password;
        localStorage.setItem('credentials', btoa(credentials));
      }

      this.loginUser(this.userData);
      return;
    }
  }

  signupClicked(type) {

    if (type == "facebook") {
      alert("not yet implemented!");
      return;
    }

    if (type == "strava") {
      this.stravaOauth.startOauthFlow();
      alert("not yet implemented!");
      return;
    }

    this.validateForm();
    if(this.errors.length > 0){ return; }

    if (type == "email") {
      this.registerUser();
      return;
    }
  }


  validateForm(){

    this.errors = [];

    if(this.userData.email == undefined){
      this.errors.push("the email address is required!");
    
    } else if( !this.userData.email.includes("@") ){
      this.errors.push("the email address is not valid!");
    }

    if(this.userData.password == undefined){
      this.errors.push("the password field is requred!");

    } else {
      let weakPassword = true;
      "~!@#$%^&*_+}{?><".split("").forEach(chr => { if (this.userData.password.includes(chr)){ weakPassword = false } });

      if(weakPassword){
        this.errors.push("the password is too week include at least one of the special characters: ~, !, @, #, $, %, ^, &, *, _, +, }, {, ?, >, <")
      }

      if(this.userData.password.length < 6){
        this.errors.push("the password is too short, it must have at least 6 characters");
      }
    }

  }

  stravaTokenExchange(){
    this.stravaOauth.onOauthRedirect()
    .subscribe(
      res => {

        localStorage.setItem("stravaAccess", res.access_token);
        localStorage.setItem("stravaRefresh", res.refresh_token);
        
        let name =res.athlete.username;
        let email = name + "@strava";
        let password = res.access_token;

        this.loginUser({
          username:name,
          email:email,
          password:password
        });

      },
      err => console.log(err) 
    )
  }
   
}
