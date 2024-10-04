import { SnackBarService } from './../../services/snackbar.service';
import { selectEmployeeLeaves, selectLeaveLoading } from './../../store/leaves/selectors';
import { DurationData } from '../../shared/data/duration.data';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ListModel } from 'src/app/models/list-model';
import { AuthService } from 'src/app/services/auth.service';
import { LeaveTypeData } from 'src/app/shared/data/leaves-type.data';
import { differenceInCalendarDays } from 'date-fns';
import { SharedModule } from 'src/app/shared/shared.module';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { CommonModule, NgIf } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { leaveStatusData } from 'src/app/shared/data/leave-status.data';
import { Observable, Subject, takeUntil } from 'rxjs';
import { ILeave, ILeaveAddResponse, ILeavesResponse } from 'src/app/models/leaves.model';
import { Store } from '@ngrx/store';
import { selectAddLeave } from 'src/app/store/leaves/selectors';
import { AppState } from 'src/app/store/reducer';
import { addLeave, deleteEmployeeLeave, filterOneEmployeeLeaves, getEmployeeLeaves } from 'src/app/store/leaves/actions';

@Component({
  selector: 'app-leaves',
  standalone: true,
  imports: [DemoMaterialModule, ReactiveFormsModule, SharedModule, NgIf, CommonModule],
  templateUrl: './manage-leaves.component.html',
  styleUrl: './manage-leaves.component.scss'
})
export class ManageLeavesComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  /**
   * Observable to handle adding leave response, leaves and loading.
   */
  private destroy$ = new Subject<void>()
  addLeave$: Observable<ILeaveAddResponse | null>;
  leaves$: Observable<ILeavesResponse | null>;
  loading$: Observable<boolean>;

  /**
  * List of leave types, status and duration available for the employee.
  */
  leaveTypeList: ListModel[] = LeaveTypeData;
  durationList: ListModel[] = DurationData;
  leaveStatusList: ListModel[] = leaveStatusData;

  numberOfDays: number = 0;
  balancedLeaves: number = 0;
  empId: string = '';

  /**
   * Boolean flag to toggle the visibility of the "Add Leave" form.
   */
  addLeaveFormShow: boolean = false;

  /**
* DataSource for the MatTable used to display employees with pagination.
*/
  dataSource!: MatTableDataSource<any>;
  displayedColumns: string[] = ['start_date', 'end_date', 'leaves_type', 'leaves', 'duration', 'reason', 'leave_status', 'actions'];

  /**
   * Form group for adding a new leave.
   */
  employeeLeaveForm = new FormGroup({
    leaves_type: new FormControl('', [Validators.required]),
    start_date: new FormControl('', [Validators.required]),
    end_date: new FormControl('', [Validators.required]),
    reason: new FormControl('', [Validators.required]),
    duration: new FormControl()
  });

  /**
 * Form group for applying filters on leave type.
 */
  leaveTypesForm = new FormGroup({
    leave_type: new FormControl('')
  });

  /**
   * Constructor for the component, injecting necessary services and initializing observables.
   *
   * @param authService - Service to handle authentication and user information.
   * @param snackBarService - Service to display snackbars for user feedback.
   * @param store - NGRX store to manage leave-related state.
   */
  constructor(
    private authService: AuthService,
    private snackBarService: SnackBarService,
    private store: Store<AppState>
  ) {
    this.addLeave$ = this.store.select(selectAddLeave);
    this.leaves$ = this.store.select(selectEmployeeLeaves);
    this.loading$ = this.store.select(selectLeaveLoading);
  }

  ngOnInit(): void {
    this.empId = this.authService.getUserIdFromToken();

    this.onloadEmployeeLeaves();
    this.calculateNoOfDays();
    this.leaveSubscription();
    this.onApplyFilters();
  }

  /**
 * Handler for the "Add Leave" button click to toggle the form visibility.
 */
  onAddLeaveButtonClick() {
    this.addLeaveFormShow = true;
  }

  /**
   * Handler for the "Close" button in the add leave form to reset and hide it.
   */
  onCloseButtonClick() {
    this.addLeaveFormShow = false;
    this.employeeLeaveForm.reset();
    this.numberOfDays = 0;
  }

  /**
  * Subscribes to the leave type filter form changes and dispatches actions to filter the employee leaves.
  */
  onApplyFilters() {
    this.leaveTypesForm.get('leave_type')?.valueChanges.subscribe((value) => {
      if (value) {
        console.log('Selected Leave Type:', value);
        this.store.dispatch(filterOneEmployeeLeaves({ empId: this.empId, leaveType: value }));
      }
    });
  }

  /**
   * Clears the leave type filter and reloads all leaves for the employee.
   */
  onClearFilters() {
    this.leaveTypesForm.reset();
    this.onloadEmployeeLeaves();
  }


  /**
   * Handles the "Add Leave" form submission, dispatching the leave data to the store.
   */
  onAddLeave() {
    const formValues = this.employeeLeaveForm.value;
    const leaveData = {
      ...formValues,
      leaves: this.numberOfDays
    };

    this.store.dispatch(addLeave({ payload: leaveData }));

    this.addLeave$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        if (res) {
          this.snackBarService.openAlert({ message: res.message, type: "success" })
          this.addLeaveFormShow = false;
          this.employeeLeaveForm.reset();
          this.numberOfDays = 0;
        }
      },
      error: (error) => {
        const errorMsg = error?.error?.message;
        this.snackBarService.openAlert({ message: errorMsg, type: "error" })
      }
    });
  }

  /**
   * Calculates the number of leave days based on the selected start and end dates.
   */
  calculateNoOfDays() {
    this.employeeLeaveForm.valueChanges.subscribe(values => {
      const startDate = values.start_date;
      const endDate = values.end_date;

      if (startDate && endDate) {
        this.numberOfDays = differenceInCalendarDays(new Date(endDate), new Date(startDate)) + 1;
      } else {
        this.numberOfDays = 0;
      }
    });
  }

  /**
  * Dispatches an action to load all employee leaves.
  */
  onloadEmployeeLeaves() {
    this.store.dispatch(getEmployeeLeaves({ empId: this.empId }));
  }

  /**
   * Deletes a specific leave based on the leave ID.
   * @param leave - The leave object to be deleted.
   */
  onDeleteLeave(leave: ILeave) {
    this.store.dispatch(deleteEmployeeLeave({ leaveId: leave._id, noOfLeaves: leave.leaves }));
  }

  /**
  * Subscribes to the leaves observable and updates the data source for the leaves table.
  */
  leaveSubscription() {
    this.leaves$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (data: ILeavesResponse | null) => {
        const leaves = data?.leaves ?? [];
        this.dataSource = new MatTableDataSource<any>(leaves);
        this.dataSource.paginator = this.paginator;
        this.balancedLeaves = data?.balanced_leaves ?? 0;
      },
      error: (error) => {
        const errorMsg = error?.error?.message;
        this.snackBarService.openAlert({ message: errorMsg, type: "error" })
      }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
