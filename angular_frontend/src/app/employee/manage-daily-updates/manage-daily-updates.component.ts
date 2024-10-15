import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { IDailyUpdate } from 'src/app/models/daily-updates.model';
import { AuthService } from 'src/app/services/auth.service';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { AppState } from 'src/app/store/reducer';
import { AddDailyUpdateComponent } from '../add-daily-update/add-daily-update.component';
import { selectDailyUpdates, selectDailyUpdatesLoading } from 'src/app/store/daily-update/selectors';
import { addDailyUpdate, getEmployeeDailyUpdates } from 'src/app/store/daily-update/actions';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IProject } from 'src/app/models/project.model';
import { getEmployeeProjects } from 'src/app/store/project/actions';
import { selectProjects } from 'src/app/store/project/selectors';
import { UpdateDailyUpdateComponent } from '../update-daily-update/update-daily-update.component';

@Component({
  selector: 'app-manage-daily-updates',
  standalone: true,
  imports: [
    DemoMaterialModule,
    SharedModule,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './manage-daily-updates.component.html',
  styleUrl: './manage-daily-updates.component.scss'
})
export class ManageDailyUpdatesComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  /**
   * Observable to handle daily updates and loading.
   */
  private destroy$ = new Subject<void>()
  dailyUpdates$: Observable<IDailyUpdate[]>;
  projects$: Observable<IProject[]>;
  loading$: Observable<boolean>;

  empId: string = '';
  dialog = inject(MatDialog);
  dailyUpdates: IDailyUpdate[] = [];
  projects!: IProject[];

  /**
   * Form of updating project information.
   */
  updateDailyUpdateForm: FormGroup = new FormGroup({
    work: new FormControl(''),
    project_type: new FormControl(''),
    project: new FormControl([]),
    skill_title: new FormControl(''),
    hours: new FormControl(0),
    update_content: new FormControl('')
  });

  constructor(
    private snackBarService: SnackBarService,
    private authService: AuthService,
    private store: Store<AppState>,
  ) {
    this.dailyUpdates$ = this.store.select(selectDailyUpdates);
    this.projects$ = this.store.select(selectProjects);
    this.loading$ = this.store.select(selectDailyUpdatesLoading);
  }

  ngOnInit(): void {
    this.empId = this.authService.getUserIdFromToken();
    this.onLoadDailyUpdates();
    this.onLoadEmployeeProjects();
  }

  /**
   * Dispatches an action to load all projects.
   */
  onLoadDailyUpdates() {
    this.store.dispatch(getEmployeeDailyUpdates({ empId: this.empId }));
    this.dailyUpdates$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (dailyUpdates: IDailyUpdate[]) => {
        this.dailyUpdates = dailyUpdates;
      },
      error: (error) => {
        const errorMsg = error?.error?.message;
        this.snackBarService.openAlert({ message: errorMsg, type: "error" })
      }
    })
  }

  /**
  * Dispatches an action to load all projects.
  */
  onLoadEmployeeProjects() {
    this.store.dispatch(getEmployeeProjects({ empId: this.empId }));
    this.projects$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (projects: IProject[]) => {
        this.projects = projects;
      },
      error: (error) => {
        const errorMsg = error?.error?.message;
        this.snackBarService.openAlert({ message: errorMsg, type: "error" })
      }
    })
  }

  /**
  * Open a AddDailyUpdateComponent dialog component with form to add daily update.
  */
  openAddDailyUpdateDialog(): void {
    const dialogRef = this.dialog.open(AddDailyUpdateComponent, {
      width: '400px',
      data: this.projects
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        result.emp = this.empId;
        this.store.dispatch(addDailyUpdate({ payload: result }));
      }
    });
  }

  isToday(date: string | undefined): boolean {
    const today = new Date();
    if (date) {
      const updateDate = new Date(date);

      // Compare year, month, and date to check if the date is today
      return today.getFullYear() === updateDate.getFullYear() &&
        today.getMonth() === updateDate.getMonth() &&
        today.getDate() === updateDate.getDate();
    }
    return false;
  }

  openUpdateDailyUpdateDialog(dailyUpdate: IDailyUpdate) {
    this.dialog.open(UpdateDailyUpdateComponent, {
      width: '400px',
      data: { dailyUpdate: dailyUpdate, projects: this.projects }
    });
  }
}
