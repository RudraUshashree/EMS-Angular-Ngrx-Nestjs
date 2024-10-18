import { Component, OnDestroy, OnInit } from '@angular/core';
import { EmployeeLeavesTypesChartComponent } from './emp-dashboard-components/employee-leaves-types-chart/employee-leaves-types-chart.component';
import { ProfileComponent } from './emp-dashboard-components/profile/profile.component';
import { ManageEmployeeComponent } from './emp-dashboard-components/manage-employee/manage-employee.component';
import { AuthService } from 'src/app/services/auth.service';
import { UpdateProfileComponent } from './emp-dashboard-components/update-profile/update-profile.component';
import { CommonModule, NgIf } from '@angular/common';
import { Store } from '@ngrx/store';
import { selectGetEmployeesLoading, selectGetOneEmployee } from 'src/app/store/employee/selectors';
import { IEmployee } from 'src/app/models/employee.model';
import { Observable, Subject, takeUntil } from 'rxjs';
import { getOneEmployee } from 'src/app/store/employee/actions';
import { AppState } from 'src/app/store/reducer';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { IAssociatedData, ILeave, ILeavesResponse } from 'src/app/models/leaves.model';
import { selectEmployeeLeaves, selectLeaveLoading } from 'src/app/store/leaves/selectors';
import { getEmployeeLeaves } from 'src/app/store/leaves/actions';
import { leaveStatusData } from 'src/app/shared/data/leave-status.data';
import { LeaveTypeData } from 'src/app/shared/data/leaves-type.data';
import { EmployeeLeavesStatusChartComponent } from './emp-dashboard-components/employee-leaves-status-chart/employee-leaves-status-chart.component';
import { SpinnerComponent } from 'src/app/shared/spinner.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    EmployeeLeavesTypesChartComponent,
    EmployeeLeavesStatusChartComponent,
    ProfileComponent,
    ManageEmployeeComponent,
    UpdateProfileComponent,
    SpinnerComponent
  ],
  templateUrl: './emp-dashboard.component.html'
})
export class EmployeeDashboardComponent implements OnInit, OnDestroy {

  /**
   * Observable that holds the current employee data, leaves. loading and leave loading.
   */
  private destroy$ = new Subject<void>()
  employee$: Observable<IEmployee | null>;
  leaves$: Observable<ILeavesResponse | null>;
  loading$: Observable<boolean>;
  leaveLoading$: Observable<boolean>;

  empId: string = '';
  leaves: ILeave[] = [];
  leavesTypes: IAssociatedData = {};
  leaveStatus: IAssociatedData = {};
  currentEmployee!: IEmployee | null;
  showUpdateProfileForm: boolean = false;

  /**
  * Constructor to initialize the component with necessary services.
  * @param authService - Service for authentication related tasks.
  * @param snackBarService - Service to display snackbars for user feedback.
  * @param store - NGRX store for managing application state.
  */
  constructor(
    private authService: AuthService,
    private snackBarService: SnackBarService,
    private store: Store<AppState>
  ) {
    this.employee$ = this.store.select(selectGetOneEmployee);
    this.leaves$ = this.store.select(selectEmployeeLeaves);
    this.loading$ = this.store.select(selectGetEmployeesLoading);
    this.leaveLoading$ = this.store.select(selectLeaveLoading);
  }

  ngOnInit() {
    this.empId = this.authService.getUserIdFromToken();

    this.getEmployee();
    this.getLeaves();
  }

  /**
   * Fetches the current employee details from the store.
   */
  getEmployee() {
    this.store.dispatch(getOneEmployee({ empId: this.empId }));

    this.employee$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (employee) => {
        this.currentEmployee = employee;
      },
      error: (error) => {
        const errorMsg = error?.error?.message;
        this.snackBarService.openAlert({ message: errorMsg, type: "error" })
      }
    });
  }

  /**
  * Fetches the current employee's leave data from the store.
  */
  getLeaves() {
    this.store.dispatch(getEmployeeLeaves({ empId: this.empId }));

    this.leaves$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (data: ILeavesResponse | null) => {
        this.leaves = data?.leaves ?? [];

        //Leave Types Counts
        const leaveTypes = LeaveTypeData.map(type => type.value);

        const leaveTypesCounts = leaveTypes.map(type => {
          return this.leaves
            .filter(leave => leave.leaves_type === type)
            .reduce((total, leave) => total + leave.leaves, 0);
        });

        this.leavesTypes = {
          keys: leaveTypes,
          values: leaveTypesCounts
        }

        // Leave Status Counts
        const leaveStatus = leaveStatusData.map(status => status.value);

        const leaveStatusCounts = leaveStatus.map(status => {
          return this.leaves.filter(leave => leave.leave_status === status).length;
        });

        this.leaveStatus = {
          keys: leaveStatus,
          values: leaveStatusCounts
        }
      },
      error: (error) => {
        const errorMsg = error?.error?.message;
        this.snackBarService.openAlert({ message: errorMsg, type: "error" })
      }
    })
  }

  /**
 * Handles the update profile button click, making the update profile form visible.
 */
  onUpdateProfileButtonClicked() {
    this.showUpdateProfileForm = true;
  }

  /**
  * Handles the close button click, hiding the update profile form.
  */
  onCloseButtonClicked() {
    this.showUpdateProfileForm = false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
