import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployeeTypeData } from 'src/app/shared/data/employee-type.data';
import { WorkTypeData } from 'src/app/shared/data/work-type.data';
import { WorkedTechnologiesData } from 'src/app/shared/data/worked-technologies.data';
import { ListModel } from 'src/app/models/list-model';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { NgFor, NgIf } from '@angular/common';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/reducer';
import { IEmployee, IUpdateEmployeeResponse } from 'src/app/models/employee.model';
import { Observable, Subject } from 'rxjs';
import { updateEmployee } from 'src/app/store/employee/actions';
import { selectUpdateEmployee } from 'src/app/store/employee/selectors';

@Component({
  selector: 'app-update-profile',
  standalone: true,
  imports: [DemoMaterialModule, FormsModule, ReactiveFormsModule, NgFor, NgIf],
  templateUrl: './update-profile.component.html',
  styleUrl: './update-profile.component.scss'
})
export class UpdateProfileComponent implements OnInit {
  /**
   * Input to receive the current employee's details that need to be updated.
   */
  @Input() currentEmployee!: IEmployee | null;

  /**
   * Output event emitter triggered when the close button is clicked.
   */
  @Output() closeButtonClicked = new EventEmitter<void>();

  /**
  * Observable that contains the update employee response data.
  */
  private destroy$: Subject<void> = new Subject<void>();
  updateEmployee$: Observable<IUpdateEmployeeResponse | null>

  /**
  * Selected tab index for managing different sections in the UI.
  */
  selectedTabIndex: number = 0;

  /**
   * Lists for employee types, work types, and technologies to populate form dropdowns.
   */
  workTypeList: ListModel[] = WorkTypeData;
  empTypeList: ListModel[] = EmployeeTypeData;
  workedTechnologies: ListModel[] = WorkedTechnologiesData;

  /**
   * Reactive form group for updating employee details.
   */
  updateEmployeeForm = new FormGroup({
    name: new FormControl(''),
    dob: new FormControl(''),
    contact: new FormControl(),
    address: new FormControl(),
    city: new FormControl(),
    zipcode: new FormControl(),
    emp_type: new FormControl(),
    work_type: new FormControl(),
    experience: new FormControl(),
    salary: new FormControl(),
    worked_technologies: new FormControl(),
    doj: new FormControl(),
  });

  constructor(
    private store: Store<AppState>
  ) {
    this.updateEmployee$ = this.store.select(selectUpdateEmployee);
  }

  ngOnInit(): void {
    this.loadEmployeeData();
  }

  /**
  * Loads the employee data into the form fields for editing.
  * Converts the `worked_technologies` string into an array if needed.
  */
  loadEmployeeData() {
    const workedTechnologies = this.currentEmployee?.worked_technologies ?? '';

    this.updateEmployeeForm = new FormGroup({
      name: new FormControl(this.currentEmployee?.name ?? '', [Validators.required, Validators.minLength(3)]),
      dob: new FormControl(this.currentEmployee?.dob ?? '', [Validators.required]),
      contact: new FormControl(this.currentEmployee?.contact ?? '', [Validators.required, Validators.pattern('^[0-9]{10}$')]),
      address: new FormControl(this.currentEmployee?.address ?? '', [Validators.required]),
      city: new FormControl(this.currentEmployee?.city ?? ''),
      zipcode: new FormControl(this.currentEmployee?.zipcode ?? '', [Validators.pattern('^[0-9]{5,6}$')]),
      emp_type: new FormControl(this.currentEmployee?.emp_type ?? '', [Validators.required]),
      work_type: new FormControl(this.currentEmployee?.work_type ?? '', [Validators.required]),
      experience: new FormControl(this.currentEmployee?.experience ?? null, [Validators.required]),
      salary: new FormControl(this.currentEmployee?.salary ?? null, [Validators.required]),
      doj: new FormControl(this.currentEmployee?.doj ?? '', [Validators.required]),
      worked_technologies: new FormControl(
        typeof workedTechnologies === 'string' ? workedTechnologies.split(',') : workedTechnologies, [Validators.required]
      ),
    });
  }

  /**
   * Emits the closeButtonClicked event when the close button is clicked.
   */
  onClose() {
    this.closeButtonClicked.emit();
  }

  /**
   * Handles the update button click. If any form fields have been modified,
   * the updated values are dispatched to the store for processing.
   */
  onUpdateEmployee() {
    if (this.currentEmployee) {
      let updatedValues: any = {};

      // Loop over the controls and check if they are dirty
      Object.keys(this.updateEmployeeForm.controls).forEach(key => {
        const control = this.updateEmployeeForm.get(key);

        // Check if the control is dirty (value has changed)
        if (control?.dirty) {
          updatedValues[key] = control.value;
        }
      });
      this.store.dispatch(updateEmployee({ empId: this.currentEmployee._id, payload: updatedValues }));
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
