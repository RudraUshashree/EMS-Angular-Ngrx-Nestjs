import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { CommonModule, DatePipe, NgFor, NgIf } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WorkedTechnologiesData } from 'src/app/shared/data/worked-technologies.data';
import { EmployeeTypeData } from 'src/app/shared/data/employee-type.data';
import { ListModel } from 'src/app/models/list-model';
import { debounceTime, distinctUntilChanged, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { IEmployee, IUpdateEmployeePayload, IUpdateEmployeeResponse } from 'src/app/models/employee.model';
import { selectGetEmployees, selectGetEmployeesLoading, selectUpdateEmployee } from 'src/app/store/employee/selectors';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/reducer';
import { filterEmployees, getEmployees, searchEmployees, updateEmployeeStatus } from 'src/app/store/employee/actions';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { SpinnerComponent } from 'src/app/shared/spinner.component';

@Component({
  selector: 'app-manage-employees',
  standalone: true,
  imports: [
    DemoMaterialModule,
    NgIf,
    NgFor,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    SpinnerComponent
  ],
  providers: [DatePipe],
  templateUrl: './manage-employees.component.html',
  styleUrls: ['./manage-employees.component.scss']
})
export class ManageEmployeesComponent implements OnInit, OnDestroy {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Input() employeesData: IEmployee[] = [];

  /**
  * Observables for handling employees, search results, employee status updates, and loading states.
  */
  private destroy$ = new Subject<void>();
  filteredEmployees$: Observable<IEmployee[]>;
  searchEmployees$: Observable<IEmployee[]>;
  employees$: Observable<IEmployee[] | []>;
  updateEmployeeStatus$: Observable<IUpdateEmployeeResponse | null>;
  loading$: Observable<boolean>;

  /**
 * Lists for employee types and technologies.
 */
  empTypeList: ListModel[] = EmployeeTypeData;
  workedTechnologies: ListModel[] = WorkedTechnologiesData;

  /**
 * Form control for searching employees and selected filters for employee type and technologies.
 */
  searchControl = new FormControl();
  selectedEmpType: string = '';
  selectedworkedTechnologies: string[] = [];

  /**
   * Used to manage selected tab index in the manage-employees and the currently selected employee for updates.
  */
  selectedTabIndex: number = 0;
  selectedEmployee!: IEmployee;

  /**
  * DataSource for the MatTable used to display employees with pagination.
  */
  dataSource!: MatTableDataSource<any>;
  displayedColumns: string[] = ['image', 'name', 'email', 'dob', 'contact', 'city', 'experience', 'emp_type', 'worked_technologies', 'status'];

  photoUrl!: string;

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
    worked_technologies: new FormControl(),
    status: new FormControl(),
  });

  constructor(
    private snackBarService: SnackBarService,
    private store: Store<AppState>,
    private datePipe: DatePipe,
  ) {
    this.employees$ = this.store.select(selectGetEmployees);
    this.loading$ = this.store.select(selectGetEmployeesLoading);
    this.updateEmployeeStatus$ = this.store.select(selectUpdateEmployee);
    this.filteredEmployees$ = this.store.select(selectGetEmployees);
    this.searchEmployees$ = this.store.select(selectGetEmployees);
  }

  /**
   * Lifecycle hook for initializing the component.
   * This method loads employees and sets up search functionality.
   */
  ngOnInit(): void {
    this.loadAllEmployees();

    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((searchTerm) => {
        this.store.dispatch(searchEmployees({ searchName: searchTerm }));
        return this.searchEmployees$;
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (employee: IEmployee[]) => {
        this.dataSource.data = employee;
      },
      error: (error) => {
        const errorMsg = error?.error?.message;
        this.snackBarService.openAlert({ message: errorMsg, type: "error" });
      }
    });
  }

  /**
   * Loads all employees from the store and updates the dataSource for the table.
   */
  loadAllEmployees() {
    this.store.dispatch(getEmployees());
    this.employees$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (employees) => {
        this.dataSource = new MatTableDataSource<IEmployee>(employees);
        this.dataSource.paginator = this.paginator;
      }
    })
  }

  /**
  * Handles row click event and sets the selected employee details for updating.
  * @param data - Employee data for the clicked row
  */
  onRowClicked(data: IEmployee) {
    this.selectedTabIndex = 1;
    this.selectedEmployee = data;
    this.photoUrl = data.photoUrl;

    const formattedDate = this.datePipe.transform(data['dob'], 'yyyy-MM-dd');

    this.employeeForm = new FormGroup({
      name: new FormControl(data['name']),
      dob: new FormControl(formattedDate),
      contact: new FormControl(data['contact']),
      address: new FormControl(data['address']),
      city: new FormControl(data['city']),
      zipcode: new FormControl(data['zipcode']),
      emp_type: new FormControl(data['emp_type']),
      work_type: new FormControl(data['work_type']),
      experience: new FormControl(data['experience']),
      salary: new FormControl(data['salary']),
      worked_technologies: new FormControl(data['worked_technologies']),
      status: new FormControl(data['status']),
    });
  }


  /**
   * Updates the status of the selected employee and dispatches the action to the store.
   */
  onUpdateStatus() {
    if (this.selectedEmployee) {
      const updatedStatus = this.employeeForm.get('status')?.value;
      const updatedData: IUpdateEmployeePayload = {
        status: updatedStatus
      };

      this.store.dispatch(updateEmployeeStatus({ empId: this.selectedEmployee._id, payload: updatedData }));
      this.updateEmployeeStatus$.pipe(takeUntil(this.destroy$)).subscribe({
        next: () => {
          this.selectedTabIndex = 0;
        },
        error: () => {
          this.selectedTabIndex = 1;
        }
      })
    }
  }

  /**
   * Applies filters based on selected employee type and worked technologies.
   */
  applyFilters() {
    this.store.dispatch(filterEmployees({ employeeType: this.selectedEmpType, workedTechnologies: this.selectedworkedTechnologies }));
    this.filteredEmployees$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (employees: IEmployee[]) => {
        this.dataSource.data = employees;
      },
      error: (error) => {
        const errorMsg = error?.error?.message;
        this.snackBarService.openAlert({ message: errorMsg, type: "error" });
      }
    })
  }

  /**
   * Handles the search input event, updating the search form control value.
   * @param event - Input event from the search bar
   */
  onSearch(event: any) {
    this.selectedEmpType = '';
    this.selectedworkedTechnologies = [];
    const value = event.target.value;
    this.searchControl.setValue(value);
  }

  /**
   * Clears all filters and reloads all employees.
   */
  onClearFilters() {
    this.selectedEmpType = '';
    this.selectedworkedTechnologies = [];
    this.loadAllEmployees();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
