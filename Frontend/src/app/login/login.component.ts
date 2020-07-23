import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public form: FormGroup;

  token:any=null;

  constructor(private api:ApiService, private fb:FormBuilder,private router: Router) { 
    this.form = this.fb.group({
      username:[null, {
        validators:[
          Validators.required
        ]
      }],  
        password:[null, {
          validators:[
            Validators.required
          ]
        }]
    });

  };
   

  ngOnInit(): void {
  }

  submitLogin(){
    this.api.submitLogin(this.form.value.username, this.form.value.password)
    .subscribe( (data)=>{
      this.token=[data];
      this.api.setToken(this.token);
      this.router.navigate(['home']);
    });

  }

}
