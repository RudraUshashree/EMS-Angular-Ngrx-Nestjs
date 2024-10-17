import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { selectUpdateEmployee } from 'src/app/store/employee/selectors';
import { IUpdateEmployeeResponse } from 'src/app/models/employee.model';
import { Observable, Subject, takeUntil } from 'rxjs';
import { AppState } from 'src/app/store/reducer';
import { Store } from '@ngrx/store';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { updateEmployeeStatus } from 'src/app/store/employee/actions';

@Component({
  selector: 'app-update-employee-status',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DemoMaterialModule,
    NgIf,
    NgFor
  ],
  providers: [DatePipe],
  templateUrl: './update-employee-status.component.html',
  styleUrl: './update-employee-status.component.scss'
})
export class UpdateEmployeeStatusComponent {

  /**
  * Observables for handling employee status updates.
  */
  private destroy$ = new Subject<void>();
  updateEmployeeStatus$: Observable<IUpdateEmployeeResponse | null>;

  /**
   * Form of employee information.
   */
  employeeForm = new FormGroup({
    name: new FormControl(),
    dob: new FormControl(),
    contact: new FormControl(),
    address: new FormControl(),
    city: new FormControl(),
    zipcode: new FormControl(),
    emp_type: new FormControl(),
    work_type: new FormControl(),
    experience: new FormControl(),
    salary: new FormControl(),
    doj: new FormControl(),
    worked_technologies: new FormControl(),
    status: new FormControl(),
  });

  photoUrl!: string;

  constructor(
    private store: Store<AppState>,
    private datePipe: DatePipe,
    public dialogRef: MatDialogRef<UpdateEmployeeStatusComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.updateEmployeeStatus$ = this.store.select(selectUpdateEmployee);
  }

  ngOnInit(): void {
    const employee = this.data.employee;
    this.photoUrl = employee.photoUrl;

    const formattedDOBDate = this.datePipe.transform(employee['dob'], 'yyyy-MM-dd');
    const formattedDOJDate = this.datePipe.transform(employee['doj'], 'yyyy-MM-dd');

    this.employeeForm = new FormGroup({
      name: new FormControl(employee['name']),
      dob: new FormControl(formattedDOBDate),
      contact: new FormControl(employee['contact']),
      address: new FormControl(employee['address']),
      city: new FormControl(employee['city']),
      zipcode: new FormControl(employee['zipcode']),
      emp_type: new FormControl(employee['emp_type']),
      work_type: new FormControl(employee['work_type']),
      experience: new FormControl(employee['experience']),
      salary: new FormControl(employee['salary']),
      doj: new FormControl(formattedDOJDate),
      worked_technologies: new FormControl(employee['worked_technologies']),
      status: new FormControl(employee['status']),
    });
  }

  /**
   * Updates the status of the selected employee and dispatches the action to the store.
   */
  onUpdateStatus() {
    if (this.employeeForm.value) {
      const updatedStatus = this.employeeForm.get('status')?.value;
      const updatedData = {
        status: updatedStatus
      };

      this.store.dispatch(updateEmployeeStatus({ empId: this.data.employee._id, payload: updatedData }));
      this.updateEmployeeStatus$.pipe(takeUntil(this.destroy$)).subscribe({
        next: () => {
          this.dialogRef.close();
        }
      })
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
