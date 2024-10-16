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
import { WorkTypeData } from 'src/app/shared/data/work-type.data';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SpinnerComponent } from 'src/app/shared/spinner.component';
import { getProjects } from 'src/app/store/project/actions';
import { IProject } from 'src/app/models/project.model';
import { selectProjects } from 'src/app/store/project/selectors';

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
  projects$: Observable<IProject[]>;

  employeesData: IEmployee[] = [];

  /**
   * Variables for holding employees' total count and counts of active and inactive employees.
   */
  employeesTotalCount: number = 0;
  activeEmployeesCount: number = 0;
  inactiveEmployeesCount: number = 0;

  /**
   * Variables for holding projects total count and counts of active and inactive projects.
   */
  projectsTotalCount: number = 0;
  activeProjectsCount: number = 0;
  inactiveProjectsCount: number = 0;

  /**
   * Objects for storing employee type and work type counts for chart display.
   */
  employeeTypes: IAssociatedData = {};
  workTypes: IAssociatedData = {};

  /**
 * Constructor initializes the component with the Store service to access state and selectors.
 * @param store - Store service to access global state in the app.
 */
  constructor(
    private store: Store<AppState>
  ) {
    this.employees$ = this.store.select(selectGetEmployees);
    this.projects$ = this.store.select(selectProjects);
    this.loading$ = this.store.select(selectGetEmployeesLoading);
  }

  ngOnInit(): void {
    this.loadAllEmployees();
    this.loadProjects();
  }

  /**
   * Loads all employees from the store and updates relevant data for displaying in the dashboard.
   */
  loadAllEmployees() {
    this.store.dispatch(getEmployees());
    this.employees$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (employees) => {
        this.employeesData = employees;
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

  /**
   * Dispatches an action to load all projects.
   */
  loadProjects() {
    this.store.dispatch(getProjects());
    this.projects$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (projects: IProject[]) => {
        this.projectsTotalCount = projects.length;
        this.activeProjectsCount = projects.filter(project => project.status === 'Active').length;
        this.inactiveProjectsCount = projects.filter(project => project.status === 'Inactive').length;
      }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
