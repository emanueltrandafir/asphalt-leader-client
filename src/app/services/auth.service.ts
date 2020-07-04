import { Injectable } from '@angular/core'; 
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _registerUrl = "http://localhost:8080/auth/signup";
  // private _registerUrl = "/auth/signup";
  private _loginUrl = "http://localhost:8080/auth/login";
  // private _loginUrl = "/auth/login";

  constructor(private http: HttpClient) { }

  registerUser(user){
    return this.http.post<any>(this._registerUrl, user);
  }

  loginUser(user){
    return this.http.post<any>(this._loginUrl, user);
  }

  loggedIn(){
    return !!this.getToken();
  }

  getToken(){
    return localStorage.getItem('token');
  }

}
