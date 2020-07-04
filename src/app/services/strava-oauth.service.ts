import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StravaOauthService {


  private initialRedirectUrl = "http://localhost:4200/login"
  
  private oauthUrl = "https://www.strava.com/oauth/authorize?client_id=47492&response_type=code&approval_prompt=force&scope=profile:read_all,activity:write,activity:read_all";

  private tokenExchangeUrl = "https://www.strava.com/oauth/token?client_id=47492&client_secret=e3fabe846fbdfb4eb00d6a64f6040b10752fae22&grant_type=authorization_code";


  constructor(private http: HttpClient) { }

  public startOauthFlow(){
    window.location.href = this.getOauthUrl();
  }

  private getOauthUrl(){
    return this.oauthUrl + "&redirect_uri=" + this.initialRedirectUrl;  
  }

  public onOauthRedirect(){

    let keyValuePair = window.location.href.split("?")[1].split("&")[1];
    let code = keyValuePair.split("=")[1];
    this.tokenExchangeUrl += "&code=" + code;
    return this.http.post<any>(this.tokenExchangeUrl, {});
  }

}
