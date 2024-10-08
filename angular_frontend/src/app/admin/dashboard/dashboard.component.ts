import { IAssociatedData } from 'src/app/models/leaves.model';
import { EmployeeTypeData } from 'src/app/shared/data/employee-type.data';
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { EmployeeTypeChartComponent } from './dashboard-components/employee-type-chart/employee-type-chart.component';
import { WorkTypeChartComponent } from './dashboard-components/work-type-chart/work-type-chart.component';
import { ManageEmployeesComponent } from '../manage-employees/manage-employees.component';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { selectGetEmployees, selectGetEmployeesLoading } from 'src/app/store/employee/selectors';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/reducer';
import { IEmployee } from 'src/app/models/employee.model';
import { Observable, Subject, takeUntil } from 'rxjs';
import { getEmployees } from 'src/app/store/employee/actions';
import { ListModel } from 'src/app/models/list-model';
import { WorkTypeData } from 'src/app/shared/data/work-type.data';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WorkedTechnologiesData } from 'src/app/shared/data/worked-technologies.data';
import { SpinnerComponent } from 'src/app/shared/spinner.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    EmployeeTypeChartComponent,
    WorkTypeChartComponent,
    DemoMaterialModule,
    ManageEmployeesComponent,
    SpinnerComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  /**
   * Observables for handling employees, search results, employee status updates, and loading states.
   */
  private destroy$ = new Subject<void>();
  loading$: Observable<boolean>;
  employees$: Observable<IEmployee[] | []>;

  /**
   * Lists for employee types and technologies worked on for the chart display.
   */
  empTypeList: ListModel[] = EmployeeTypeData;
  workedTechnologies: ListModel[] = WorkedTechnologiesData;

  /**
   * Form control for searching employees and selected filters for employee type and technologies.
   */
  searchControl = new FormControl();
  selectedEmpType: string = '';
  selectedworkedTechnologies: string[] = [];
  employeesData: IEmployee[] = [];

  /**
   * DataSource for the MatTable used to display employees with pagination.
   */
  dataSource!: MatTableDataSource<any>;
  displayedColumns: string[] = ['image', 'name', 'email', 'dob', 'contact', 'city', 'experience', 'emp_type', 'worked_technologies', 'status'];

  /**
   * Variables for holding employees' total count and counts of active and inactive employees.
   */
  employeesTotalCount: number = 0;
  activeEmployeesCount: number = 0;
  inactiveEmployeesCount: number = 0;

  /**
   * Objects for storing employee type and work type counts for chart display.
   */
  employeeTypes: IAssociatedData = {};
  workTypes: IAssociatedData = {};

  /**
   * Form for updating employee information.
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

  /**
 * Constructor initializes the component with the Store service to access state and selectors.
 * @param store - Store service to access global state in the app.
 */
  constructor(
    private store: Store<AppState>
  ) {
    this.employees$ = this.store.select(selectGetEmployees);
    this.loading$ = this.store.select(selectGetEmployeesLoading);
  }

  ngOnInit(): void {
    this.loadAllEmployees();
  }

  /**
   * Loads all employees from the store and updates relevant data for displaying in the dashboard.
   */
  loadAllEmployees() {
    this.store.dispatch(getEmployees());
    this.employees$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (employees) => {
        this.employeesData = employees;
        this.dataSource = new MatTableDataSource<IEmployee>(this.employeesData);
        this.dataSource.paginator = this.paginator;

        this.employeesTotalCount = this.employeesData.length;
        this.activeEmployeesCount = this.employeesData.filter(etype => etype.status === 'Active').length;
        this.inactiveEmployeesCount = this.employeesData.filter(etype => etype.status === 'Inactive').length;

        //Emp Types Count
        const employeeTypes = EmployeeTypeData.map(etype => etype.value);

        const employeeTypesCounts = employeeTypes.map(empType => {
          return this.employeesData.filter(etype => etype.emp_type === empType).length;
        });

        this.employeeTypes = {
          keys: employeeTypes,
          values: employeeTypesCounts
        }

        // Work Types Count
        const workTypes = WorkTypeData.map(wtype => wtype.value);

        const workTypesCounts = workTypes.map(workType => {
          return this.employeesData.filter(wtype => wtype.work_type === workType).length;
        });

        this.workTypes = {
          keys: workTypes,
          values: workTypesCounts
        }
      }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
