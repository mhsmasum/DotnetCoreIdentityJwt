import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http:HttpClient) { }

  getProducts(){
    return this.http.get(environment.baseUrl+"ProductSetting/getproducts");
  }

  addProduct(formGroup){
    
    var body = {
      Name:formGroup.Name,
      Price:formGroup.Price,
    };
    return this.http.post(environment.baseUrl + 'ProductSetting/saveproduct', body);
  }

  updateProduct(formGroup){

  
    var body = {
      Id: formGroup.Id,
      Name:formGroup.Name,
      Price:formGroup.Price,
    };
    return this.http.post(environment.baseUrl + 'ProductSetting/updateproduct', body);
  
  }

  deleteProduct(id){
    let params = new HttpParams().set("id",id)
    return this.http.delete(environment.baseUrl+'ProductSetting/deleteproduct', { params:params});
  }
}
