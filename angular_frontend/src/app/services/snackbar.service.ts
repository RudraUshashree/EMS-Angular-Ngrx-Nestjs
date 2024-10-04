import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarContentComponent } from '../shared/snack-bar.component';

@Injectable({
  providedIn: 'root',
})
export class SnackBarService {
  /**
   * Constructor for SnackBarService, injecting MatSnackBar.
   *
   * @param snackBar - The Angular Material MatSnackBar instance for showing snack bars.
   */
  constructor(private snackBar: MatSnackBar) { }

  /**
   * Opens a custom snack bar alert with the specified message and type.
   * The snack bar will display for 3 seconds and is centered on the top of the screen.
   *
   * @param alert - Object containing the message to display and the type of alert
   * (either 'error', 'success', or 'warning').
   * @returns void
   */
  openAlert(alert: { message: string; type: 'error' | 'success' | 'warning' }) {
    this.snackBar.openFromComponent(SnackBarContentComponent, {
      data: { message: alert.message, type: alert.type },
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 3000
    });
  }
}
