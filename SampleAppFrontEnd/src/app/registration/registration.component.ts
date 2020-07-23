import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  
  formModel:FormGroup;
  constructor(private fb: FormBuilder , private userService:UserService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.toastr.show("Welcome");
    this.resetForm();
  }
  resetForm(){
    this.formModel = this.fb.group({
      UserName: ['', Validators.required],
      Email: ['', Validators.email],
      FullName: [''],
      Passwords: this.fb.group({
        Password: ['', [Validators.required, Validators.minLength(4)]],
        ConfirmPassword: ['', Validators.required]
      }, { validator: this.comparePasswords })
  
    });
  }

  comparePasswords(fb: FormGroup) {
    let confirmPswrdCtrl = fb.get('ConfirmPassword');
    //passwordMismatch
    //confirmPswrdCtrl.errors={passwordMismatch:true}
    if (confirmPswrdCtrl.errors == null || 'passwordMismatch' in confirmPswrdCtrl.errors) {
      if (fb.get('Password').value != confirmPswrdCtrl.value)
        confirmPswrdCtrl.setErrors({ passwordMismatch: true });
      else
        confirmPswrdCtrl.setErrors(null);
    }
  }
  registerUser(){
    if(!this.formModel.invalid){
      this.userService.registerUser(this.formModel).subscribe(
        (res: any) => {
          
          if (res.succeeded) {
            this.resetForm();
            this.toastr.success('New user created!', 'Registration successful.');
          } else {
            res.errors.forEach(element => {
              switch (element.code) {
                case 'DuplicateUserName':
                  this.toastr.error('Username is already taken','Registration failed.');
                  break;
  
                default:
                this.toastr.error(element.description,'Registration failed.');
                  break;
              }
            });
          }
        },
        err => {
          console.log(err);
        }
      );
    }
  }
}
