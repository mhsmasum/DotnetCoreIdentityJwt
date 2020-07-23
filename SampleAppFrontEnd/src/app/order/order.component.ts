import { Component, OnInit, Inject } from '@angular/core';
import { OrderService } from '../services/order.service';
import { OrderDetails } from '../models/order-details';
import { OrderMaster } from '../models/order-master';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  procuctList= [];

  selectedProduct :OrderDetails ;
  theOrder:OrderMaster = {
    OrderId:0,
    OrderAmount:0,
    CustomerId:0,
  };
  theOrderDetails : OrderDetails[] = []
  totalPrice=0;
  constructor(
    private orderService:OrderService , private toaster:ToastrService,
    public dialogRef: MatDialogRef<OrderComponent>,
    @Inject(MAT_DIALOG_DATA) public data
    ) { }

  ngOnInit(): void {
    
    this.getProducts();
    this.resetProduct();
    if(this.data){
      this.populateInfo();
      
    }
  }

  populateInfo(){
    this.theOrder.OrderAmount = this.data.orderAmount

      for(var i=0;i<this.data.orderDetails.length;i++){
         this.selectedProduct.Name = this.data.orderDetails[i].product.name;
         this.selectedProduct.Price = this.data.orderDetails[i].product.price;
         this.selectedProduct.ProductCount = this.data.orderDetails[i].productCount;
         this.selectedProduct.TotalAmount = this.data.orderDetails[i].totalAmount
         this.theOrderDetails.push(this.selectedProduct);
         this.resetProduct();
      }
  }
  getProducts(){
    this.orderService.getProducts().subscribe(
      (response:any)=>{
        this.procuctList = response;
      },
      
      err => {
        console.log(err);
      },
    );
  }
  resetProduct(){
    this.selectedProduct ={
      OrderDetailsId:0,
    OrderId:0,
    ProductId:0,
    ProductCount:0,
    TotalAmount:0,
    Name:'',
    Price:0
     
    };
  }
  onProductChange(event){
    
    // this.resetProduct();
    var id = event.target.value;
    var product = this.procuctList.find(a=>a.id==id);
    this.selectedProduct.Name = product.name;
    this.selectedProduct.ProductId = product.id;
    this.selectedProduct.Price = product.price;
    this.selectedProduct.ProductCount = 0;
  }
  

  applyQty(event){
    
    let qty= event.target.value;
    this.selectedProduct.ProductCount = +qty;
    this.selectedProduct.TotalAmount = this.selectedProduct.Price*qty;
    
  }
  addProductToList(){
    if(this.selectedProduct.ProductCount>0){

      
      var aOrderItem =  this.theOrderDetails.find(a=>a.ProductId==this.selectedProduct.ProductId);
      if(aOrderItem){
        aOrderItem.ProductCount = aOrderItem.ProductCount+this.selectedProduct.ProductCount;
        aOrderItem.TotalAmount = aOrderItem.TotalAmount+this.selectedProduct.TotalAmount;
      }
      else{
        this.theOrderDetails.push(this.selectedProduct);
      }
      

      
      this.theOrder.OrderAmount += this.selectedProduct.TotalAmount;
      this.updateTotal();
     }
     this.resetProduct();
  }
  updateTotal(){
    this.theOrder.OrderAmount =   this.theOrderDetails.reduce((prev, curr) => {
      return prev + curr.TotalAmount;
    }, 0);

  }
  removeItem(product , index){
    this.theOrderDetails.splice(index,1);
    this.updateTotal();
  }
  close(){
    this.dialogRef.close();
  }
  saveOrder(){
    
    if(this.theOrder.OrderAmount==0){
      this.toaster.warning("Order amount cannot be 0");
    }
    else if(this.theOrderDetails.length==0){
      this.toaster.warning("Order item required");
    }
    else{
      this.orderService.saveOrder(this.theOrder , this.theOrderDetails).subscribe(
        (response:any)=>{
          if(response==true){
            this.toaster.success("Order Saved");
            this.dialogRef.close();
          }
        }
  
      );
    }

    
  }

}
