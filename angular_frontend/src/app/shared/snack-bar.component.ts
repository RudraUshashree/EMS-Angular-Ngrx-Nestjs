import { Component, Inject, inject } from '@angular/core';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarModule,
  MatSnackBarRef,
} from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-snack-bar',
  standalone: true,
  imports: [MatSnackBarModule],
  template: ``,
  styles: ``
})
export class SnackBarComponent {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA)
    public data: { message: string; type: 'error' | 'success' | 'warning' }
  ) { }

  getStyles() {
    switch (this.data.type) {
      case 'error':
        return {
          color: '#e37676',
          padding: '8px',
          'border-radius': '4px',
        };
      case 'success':
        return {
          color: 'green',
          padding: '8px',
          'border-radius': '4px',
        };
      case 'warning':
        return {
          color: 'orange',
          padding: '8px',
          'border-radius': '4px',
        };
      default:
        return {};
    }
  }

  getIcon() {
    switch (this.data.type) {
      case 'error':
        return 'error';
      case 'success':
        return 'check';
      case 'warning':
        return 'warning';
      default:
        return '';
    }
  }
}

@Component({
  selector: 'alert-content',
  template: `
    <div class="wrapper" [ngStyle]="getStyles()">
      <mat-icon aria-hidden="false" aria-label="Alert icon">
        {{ getIcon() }}
      </mat-icon>
      <span class="mesage-text" style="color: white">{{ data.message }}</span>
      <div matSnackBarActions>
        <mat-icon
          matSnackBarAction
          (click)="this.snackBarRef.dismissWithAction()"
          aria-hidden="false"
          class="close"
          aria-label="Alert icon"
        >
          close
        </mat-icon>
      </div>
    </div>

  `,
  styles: `
  .wrapper{
    display: flex;
    align-items: center;
    gap: 19px;
  }
  .mesage-text{
    flex: 1;
  }
  .close {
    color: white;
    display: flex;
    cursor: pointer;
  }
  `,
  imports: [MatIconModule, CommonModule],
  standalone: true,
})
export class SnackBarContentComponent extends SnackBarComponent {
  snackBarRef = inject(MatSnackBarRef);

  constructor(@Inject(MAT_SNACK_BAR_DATA) data: { message: string; type: 'error' | 'success' | 'warning' }) {
    super(data);
  }
}
