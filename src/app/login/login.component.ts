import { Component, OnInit } from '@angular/core'; 

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [NgbModal]
})
export class LoginComponent implements OnInit {
  
  signUpMessage = "";

  public loginUserData = {
    email:"",
    password:""
  };
 
  constructor(private modalService: NgbModal) {}
  
  ngOnInit(): void {
    this.signUpMessage = window.screen.width < 800 ? "SIGN UP" : "SIGN UP FOR FREE";
  }
 
  public openSignUpModal(): void { 
    document.getElementById("signup-modal").style.display="block";
  }

  
  


}
