import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { IDailyUpdate } from 'src/app/models/daily-updates.model';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { getDailyUpdates } from 'src/app/store/daily-update/actions';
import { selectDailyUpdates, selectDailyUpdatesLoading } from 'src/app/store/daily-update/selectors';
import { AppState } from 'src/app/store/reducer';

@Component({
  selector: 'app-daily-updates',
  standalone: true,
  imports: [
    DemoMaterialModule,
    SharedModule,
    CommonModule
  ],
  templateUrl: './daily-updates.component.html',
  styleUrl: './daily-updates.component.scss'
})
export class DailyUpdatesComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  /**
   * Observable to handle daily updates and loading.
   */
  private destroy$ = new Subject<void>()
  dailyUpdates$: Observable<IDailyUpdate[]>;
  loading$: Observable<boolean>;

  /**
 * DataSource for the MatTable used to display daily updates with pagination.
 */
  dataSource!: MatTableDataSource<any>;
  displayedColumns: string[] = ['createdAt', 'emp', 'work', 'project_type', 'project', 'skill_title', 'hours', 'update_content'];

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

  /**
  * Dispatches an action to load all projects.
  */
  onLoadDailyUpdates() {
    this.store.dispatch(getDailyUpdates());
    this.dailyUpdates$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (dailyUpdates: IDailyUpdate[]) => {
        this.dataSource = new MatTableDataSource<any>(dailyUpdates);
        this.dataSource.paginator = this.paginator;
      },
      error: (error) => {
        const errorMsg = error?.error?.message;
        this.snackBarService.openAlert({ message: errorMsg, type: "error" })
      }
    })
  }
}
