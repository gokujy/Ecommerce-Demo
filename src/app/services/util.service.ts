import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";

export enum SNACKBAR_CLASS {
  SUCCESS = 'success-snackbar',
  ERROR = 'error-snackbar',
  WARNING = 'warning-snackbar',
  INFO = 'info-snackbar',
}

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor(private httpClient: HttpClient, private snackBar: MatSnackBar) {
  }

  product() {
    return this.httpClient.get('assets/data/product.json');
  }

  inventory() {
    return this.httpClient.get('assets/data/inventory.json');
  }

  async displayToastMessage(message: string, type: 'SUCCESS' | 'ERROR' | 'WARNING' | 'INFO', action?: string, duration?: number) {
    this.snackBar.open(message, action ? action : 'close', {
      duration: duration ? duration : 3000,
      panelClass: SNACKBAR_CLASS[type]
    });
  }
}
