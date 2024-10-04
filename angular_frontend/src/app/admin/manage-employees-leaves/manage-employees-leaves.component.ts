import { LeaveTypeData } from './../../shared/data/leaves-type.data';
import { CommonModule, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { ListModel } from 'src/app/models/list-model';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { ILeave, ILeavesResponse } from 'src/app/models/leaves.model';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { leaveStatusData } from 'src/app/shared/data/leave-status.data';
import { SharedModule } from 'src/app/shared/shared.module';
import { filterEmployeesLeaves, getEmployeesLeaves, updateEmployeeLeaveStatus } from 'src/app/store/leaves/actions';
import { selectEmployeeLeaves, selectLeaveLoading } from 'src/app/store/leaves/selectors';
import { AppState } from 'src/app/store/reducer';

@Component({
  selector: 'app-manage-employees-leaves',
  standalone: true,
  imports: [DemoMaterialModule, FormsModule, ReactiveFormsModule, SharedModule, NgIf, CommonModule],
  templateUrl: './manage-employees-leaves.component.html',
  styleUrl: './manage-employees-leaves.component.scss'
})
export class ManageEmployeesLeavesComponent implements OnInit, OnDestroy {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  /**
* Observables for handling leaves and loading states.
*/
  private destroy$ = new Subject<void>();
  leaves$: Observable<ILeavesResponse | null>;
  loading$: Observable<boolean>;

  /**
 * Lists for leave types and leave status.
 */
  leaveTypeList: ListModel[] = LeaveTypeData;
  leaveStatusList: ListModel[] = leaveStatusData;

  /**
* DataSource for the MatTable used to display employees with pagination.
*/
  dataSource!: MatTableDataSource<any>;
  displayedColumns: string[] = ['createdAt', 'name', 'start_date', 'end_date', 'leaves_type', 'leaves', 'duration', 'reason', 'leave_status'];

  searchControl = new FormControl();
  selectedLeaveType: string = '';
  selectedLeaveStatus: string = '';

  /**
 * Constructor for initializing the store and snack bar service.
 * @param snackBarService - Service for displaying snackbar alerts
 * @param store - Store for managing application state
 */
  constructor(
    private snackBarService: SnackBarService,
    private store: Store<AppState>
  ) {
    this.leaves$ = this.store.select(selectEmployeeLeaves);
    this.loading$ = this.store.select(selectLeaveLoading);
  }

  ngOnInit(): void {
    this.loadEmployeesLeaves();
    this.leaveSubscription();
  }

  /**
 * Dispatches an action to load employees' leave data from the store.
 */
  loadEmployeesLeaves() {
    this.store.dispatch(getEmployeesLeaves());
  }

  /**
 * Handles changes to the leave status for an employee.
 * Dispatches an action to update the leave status in the store.
 * @param val - The selected leave status
 * @param element - The employee's leave data
 */
  onLeaveStatusChange(val: any, element: ILeave) {
    const updatedLeave = JSON.parse(JSON.stringify({ ...element, leave_status: val.value }));

    let leave = {
      "empId": updatedLeave.emp._id,
      "noOfLeaves": updatedLeave.leaves,
      "leave_status": updatedLeave.leave_status
    };

    this.store.dispatch(updateEmployeeLeaveStatus({ id: updatedLeave._id, payload: leave }));
  }

  /**
 * Subscribes to the leaves observable to update the table data whenever leave data changes.
 * Sets up pagination for the table.
 */
  leaveSubscription() {
    this.leaves$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (data: ILeavesResponse | null) => {
        const leaves = data?.leaves ?? [];
        this.dataSource = new MatTableDataSource<any>(leaves);
        this.dataSource.paginator = this.paginator;
      },
      error: (error) => {
        const errorMsg = error?.error?.message;
        this.snackBarService.openAlert({ message: errorMsg, type: "error" })
      }
    })
  }

  /**
  * Applies filters based on the selected leave type and leave status.
  */
  applyFilters() {
    this.store.dispatch(filterEmployeesLeaves({ leaveType: this.selectedLeaveType, leaveStatus: this.selectedLeaveStatus }));
  }

  onClearFilters() {
    this.selectedLeaveType = '';
    this.selectedLeaveStatus = '';
    this.loadEmployeesLeaves();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
