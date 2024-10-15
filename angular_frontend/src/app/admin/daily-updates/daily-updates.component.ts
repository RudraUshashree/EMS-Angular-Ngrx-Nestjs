import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { getDailyUpdates } from 'src/app/store/daily-update/actions';
import { selectDailyUpdates, selectDailyUpdatesLoading } from 'src/app/store/daily-update/selectors';
import { AppState } from 'src/app/store/reducer';
import { EmployeeDailyUpdatesTableComponent } from './employee-daily-updates-table/employee-daily-updates-table.component';
import { IDailyUpdate, IEmp } from 'src/app/models/daily-updates.model';

interface GroupedDailyUpdate {
  emp: IEmp;
  updates: IDailyUpdate[];
}

@Component({
  selector: 'app-daily-updates',
  standalone: true,
  imports: [
    DemoMaterialModule,
    SharedModule,
    CommonModule,
    EmployeeDailyUpdatesTableComponent
  ],
  templateUrl: './daily-updates.component.html',
  styleUrls: ['./daily-updates.component.scss']
})
export class DailyUpdatesComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  dailyUpdates$: Observable<IDailyUpdate[]>;
  loading$: Observable<boolean>;

  dailyUpdates: IDailyUpdate[] = [];
  groupedDailyUpdates: GroupedDailyUpdate[] = [];

  constructor(
    private snackBarService: SnackBarService,
    private store: Store<AppState>
  ) {
    this.dailyUpdates$ = this.store.select(selectDailyUpdates);
    this.loading$ = this.store.select(selectDailyUpdatesLoading);
  }

  ngOnInit(): void {
    this.onLoadDailyUpdates();
  }

  onLoadDailyUpdates() {
    this.store.dispatch(getDailyUpdates());
    this.dailyUpdates$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (dailyUpdates: IDailyUpdate[]) => {
        this.dailyUpdates = dailyUpdates;
        this.groupedDailyUpdates = this.groupByEmployee(this.dailyUpdates);
      },
      error: (error) => {
        const errorMsg = error?.error?.message;
        this.snackBarService.openAlert({ message: errorMsg, type: "error" });
      }
    })
  }

  groupByEmployee(dailyUpdates: IDailyUpdate[]): GroupedDailyUpdate[] {
    const grouped: { [key: string]: GroupedDailyUpdate } = {};

    dailyUpdates.forEach(update => {
      const empId = update.emp._id;
      if (!grouped[empId]) {
        grouped[empId] = { emp: update.emp, updates: [] };
      }
      grouped[empId].updates.push(update);
    });

    return Object.values(grouped);
  }

  isToday(date: string | undefined): boolean {
    if (!date) return false;

    const today = new Date();
    const updateDate = new Date(date);

    return today.getFullYear() === updateDate.getFullYear() &&
      today.getMonth() === updateDate.getMonth() &&
      today.getDate() === updateDate.getDate();
  }

  trackByEmployeeId(index: number, group: GroupedDailyUpdate): string {
    return group.emp._id;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
