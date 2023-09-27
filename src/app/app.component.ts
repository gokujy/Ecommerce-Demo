import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from "@angular/router";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {HttpClientModule} from "@angular/common/http";
import {UtilService} from "./services/util.service";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatListModule} from "@angular/material/list";
import {MatTableModule} from "@angular/material/table";
import {MatTooltipModule} from "@angular/material/tooltip";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatFormFieldModule, MatIconModule, MatButtonModule, MatButtonToggleModule, HttpClientModule, MatSnackBarModule, MatListModule, MatTableModule, MatTooltipModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [UtilService]
})
export class AppComponent implements OnInit {
  title = 'ecomm-app';
  viewType = 'cards';
  inventoryList: any[] = [];
  productList: any[] = [];
  localData: any[] = [];
  totalItems: number = 0;
  totalPrice: number = 0;
  compareView = true;
  displayedColumns: string[] = ['image', 'title', 'description', 'price', 'addToCartButtons'];

  constructor(private utilService: UtilService) {
  }

  ngOnInit() {
    const data = localStorage.getItem('products');
    this.localData = data ? JSON.parse(data) : [];
    this.getProducts();
    this.getInventory();
  }

  getProducts() {
    this.utilService.product().subscribe({
      next: (res: any) => {
        console.log('products ', res);
        for (let i = 0; i < res.length; i++) {
          for (let j = 0; j < this.localData.length; j++) {
            if (res[i].id === this.localData[j].id) {
              res[i].quantity = this.localData[j].quantity;
              res[i].totalPrice = res[i].quantity * res[i].price;
            }
          }
          if (res.length - 1 === i) {
            this.productList = res;
            this.updateDetails();
          }
        }
      }, error: err => {
        console.log(err);
      }
    })
  }

  getInventory() {
    this.utilService.inventory().subscribe({
      next: (res: any) => {
        console.log('products ', res);
        this.inventoryList = res;
      }, error: err => {
        console.log(err);
      }
    })
  }

  onViewChange(event: any) {
    this.viewType = event;
  }

  updateQuantity(product: any, type: string) {
    const inventoryData = this.inventoryList.find(i => i.productId === product.id);
    const index = this.productList.findIndex(i => i.id === product.id);
    const localIndex = this.localData.findIndex(i => i.id === product.id);
    let data = {
      id: product.id,
      quantity: 1
    }
    switch (type) {
      case 'addToCart':
        this.productList[index].quantity = 1;
        this.productList[index].totalPrice = this.productList[index].quantity * this.productList[index].price;
        if (localIndex === -1) {
          this.localData.push(data);
        }
        break
      case 'remove':
        this.productList[index].quantity--;
        this.productList[index].totalPrice = this.productList[index].quantity * this.productList[index].price;
        this.localData[localIndex].quantity = this.productList[index].quantity;
        if (this.productList[index].quantity === 0) {
          this.localData.splice(index, 1);
        }
        break;
      case 'add':
        if (inventoryData.quantity > this.productList[index].quantity) {
          this.productList[index].quantity++;
          this.productList[index].totalPrice = this.productList[index].quantity * this.productList[index].price;
          if (localIndex === -1) {
            this.localData.push(data);
          } else {
            this.localData[localIndex].quantity = this.productList[index].quantity;
          }
        } else {
          alert('Sorry, you cant add more of this item');
          // this.utilService.displayToastMessage('Sorry, you cant add more of this item', 'ERROR');
        }
        break;
    }

    this.updateDetails();
    localStorage.setItem('products', JSON.stringify(this.localData));
  }

  checkQuantity(product: any) {
    const localIndex = this.localData.findIndex(i => i.id === product.id);
    const index = this.productList.findIndex(i => i.id === product.id);
    if (localIndex !== -1) {
      this.productList[index].quantity = this.localData[localIndex].quantity;
      return this.localData[localIndex].quantity ? this.localData[localIndex].quantity : 0;
    } else {
      return 0;
    }
  }

  updateDetails() {
    this.totalItems = this.productList.reduce((accumulator, object) => {
      return accumulator + (object.quantity ? object.quantity : 0);
    }, 0);
    this.totalPrice = this.productList.reduce((accumulator, object) => {
      return accumulator + (object.totalPrice ? object.totalPrice : 0);
    }, 0);
  }
}
