import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { IEmployee } from 'src/app/models/employee.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [DemoMaterialModule, CommonModule],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {

  /**
 * Input property to receive the current employee data.
 * If no employee is provided, it will be null.
 */
  @Input() currentEmployee!: IEmployee | null;

  /**
 * Output event emitter triggered when the update button is clicked.
 */
  @Output() updateButtonClicked = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void { }

  /**
  * Method to handle the click event on the "Update Profile" button.
  * Emits the `updateButtonClicked` event.
  */
  onUpdateProfile() {
    this.updateButtonClicked.emit();
  }
}
