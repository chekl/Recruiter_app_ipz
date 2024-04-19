import {Injectable} from '@angular/core';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  constructor(private snackBar: MatSnackBar) {}

  public showSuccessSnackBar(message: string) {
    const config: MatSnackBarConfig = {
      duration: 3000,
      panelClass: ['snackbar--success']
    };
    this.snackBar.open(message, '', config);
  }

  public showErrorSnackBar(message: string) {
    const config: MatSnackBarConfig = {
      duration: 3000,
      panelClass: ['snackbar--error']
    };
    this.snackBar.open(message, '', config);
  }
}
