import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http:HttpClient) { }

  getProducts(){
    return this.http.get(environment.baseUrl+"userOrder/GetProducts");
  }

  saveOrder(ordermaster , orderDetails){
  
    var body1 = {
      ...ordermaster,
      OrderDetails: orderDetails
    };

    const headers = { 'content-type': 'application/json'}  
    const body=JSON.stringify(body1);
    return this.http.post(environment.baseUrl + "userOrder/saveorder", body,{'headers':headers})
  }

  getOrdersByCustomer(){
    return this.http.get(environment.baseUrl+"userOrder/getorders");
  }

  getOrderByOrderId(id){
    let params = new HttpParams().set("orderId",id)
    return this.http.get(environment.baseUrl+'userOrder/getorder', { params:params});
  }

}
