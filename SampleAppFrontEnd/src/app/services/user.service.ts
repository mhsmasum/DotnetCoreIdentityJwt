import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient) { }

  registerUser(fromGroup){
    var body = {
      UserName: fromGroup.value.UserName,
      Email: fromGroup.value.Email,
      FullName: fromGroup.value.FullName,
      Password: fromGroup.value.Passwords.Password
    };
    return this.http.post(environment.baseUrl + 'ApplicationUser/Register', body);
  }

  loginUser(fromGroup){
    var body = {
      UserName: fromGroup.value.UserName,
      Password: fromGroup.value.Password
    };
    return this.http.post(environment.baseUrl + 'ApplicationUser/Login', body);
  }

  getUserProfile(){

    return this.http.get(environment.baseUrl +'UserProfile' )
  }
}
