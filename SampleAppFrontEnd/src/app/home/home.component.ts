import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { OrderComponent } from '../order/order.component';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  userDetails;
  orderList;
  constructor(private router: Router, private service: UserService,private dialog:MatDialog,private orderService:OrderService) { }

  ngOnInit(): void {
    this.getUserDetails();
    this.getOrders();
  }
 

  getUserDetails(){
    this.service.getUserProfile().subscribe(
      res => {
        this.userDetails = res;
      },
      err => {
        console.log(err);
      },
    );
  }

  getOrders(){
    this.orderService.getOrdersByCustomer().subscribe(
      (response:any)=>{
        
        this.orderList = response ;
      }
      ,
      err => {
        console.log(err);
      },
    );
  }
  newOrder(){
    const dialogConfig= new MatDialogConfig();
    dialogConfig.autoFocus=true;
    dialogConfig.disableClose=true;
    
    dialogConfig.width = "80%"
    // this.dialog.open(OrderComponent,dialogConfig);
   
    this.dialog.open(OrderComponent,dialogConfig).afterClosed().subscribe(res => {
     this.getOrders();
    });
  }
  viewOrder(order){
    
    this.orderService.getOrderByOrderId(order.orderId).subscribe(
      (response:any)=>{
        
        const dialogConfig= new MatDialogConfig();
        dialogConfig.autoFocus=true;
        dialogConfig.disableClose=true;
        
        dialogConfig.width = "80%"
        dialogConfig.data = response
        this.dialog.open(OrderComponent,dialogConfig);
      }
      ,
      err => {
        console.log(err);
      },
    );
  }

}
