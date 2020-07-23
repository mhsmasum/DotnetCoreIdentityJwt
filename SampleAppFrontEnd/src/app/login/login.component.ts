import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  formModel:FormGroup;
  constructor(private fb: FormBuilder , 
    private userService:UserService,
    private toastr:ToastrService,
    private router: Router ) { }

  ngOnInit(): void {

    if (localStorage.getItem('token') != null){
      this.router.navigateByUrl['/home']
    }
    this.resetForm();
  }
  resetForm(){
    this.formModel = this.fb.group({
      UserName: ['', Validators.required],
      Password: ['', [Validators.required, Validators.minLength(4)]],
    
  
    });
  }
  

  loginUser(){
    this.userService.loginUser(this.formModel).subscribe(
      (res: any) => {
        
        localStorage.setItem('token', res.token);
        this.router.navigateByUrl('/home');
      },
      err => {
        if (err.status == 400)
          this.toastr.error('Incorrect username or password.', 'Authentication failed.');
        else
          console.log(err);
      }
    );
  }
}
