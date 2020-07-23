import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ThrowStmt } from '@angular/compiler';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  constructor(
    private productService:ProductService , 
    private fb:FormBuilder, 
    private toaster:ToastrService 
    ){ }

  procuctList ;
  formModel:FormGroup;
  ngOnInit(): void {
    this.resetForm();
    this.getAllProducts();
  }

  resetForm(){
    this.formModel = this.fb.group({
      Name: ['', Validators.required],
      Id: [0, Validators.required],
      Price: ['', Validators.required, ],
    
  
    });
  }

  getAllProducts(){
    this.productService.getProducts().subscribe(
      (response:any)=>{
        
        this.procuctList = response;
      },
      
      err => {
        console.log(err);
      }
    );
  }
  addProduct(){

    let productId = this.formModel.controls["Id"].value;
    if(productId >0){
      this.productService.updateProduct(this.formModel.value).subscribe(
        (response:any)=>{
          if(response.id>0){
            this.toaster.success("Update Success");
            this.getAllProducts();
            this.resetForm();
          }
         
        },
        
        err => {
          console.log(err);
        }
      );
    }
    else{
      this.productService.addProduct(this.formModel.value).subscribe(
        (response:any)=>{
          if(response.id>0){
            this.toaster.success("New Product Added");
            this.getAllProducts();
            this.resetForm();
          }
        },
        err => {
          console.log(err);
        }
      );
    }

    



  }
  editProduct(product){
    this.formModel = this.fb.group({
      Name: [product.name, Validators.required],
      Id: [product.id, Validators.required],
      Price: [product.price, Validators.required, ],
    
  
    });
  }

  deleteProduct(product){
    this.productService.deleteProduct(product.id).subscribe(
      (response:any)=>{
        if(response.id>0){
          this.toaster.warning("Product Deleted");
          this.getAllProducts();
          
        }
      },
      err => {
        console.log(err);
      }
    );

  }
}
