import { selectGetEmployeesLoading } from './../../../../store/employee/selectors';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { NgFor, NgIf } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { ListModel } from 'src/app/models/list-model';
import { EmployeeTypeData } from 'src/app/shared/data/employee-type.data';
import { WorkedTechnologiesData } from 'src/app/shared/data/worked-technologies.data';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/reducer';
import { filterEmployees, getEmployees, searchEmployees } from 'src/app/store/employee/actions';
import { IEmployee } from 'src/app/models/employee.model';
import { selectGetEmployees } from 'src/app/store/employee/selectors';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { SpinnerComponent } from 'src/app/shared/spinner.component';

@Component({
  selector: 'app-manage-employee',
  standalone: true,
  imports: [DemoMaterialModule, NgIf, NgFor, FormsModule, ReactiveFormsModule, SpinnerComponent],
  templateUrl: './manage-employee.component.html',
  styleUrl: './manage-employee.component.scss'
})
export class ManageEmployeeComponent implements OnInit, OnDestroy {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  /**
   * Observables for handling employees, search results, employee status updates, and loading states.
   */
  destroy$ = new Subject<void>()
  filteredEmployees$: Observable<IEmployee[]>;
  searchEmployees$: Observable<IEmployee[]>;
  loading$: Observable<boolean>;
  employees$: Observable<IEmployee[]>;

  /**
   * Lists for employee types and technologies.
   */
  empTypeList: ListModel[] = EmployeeTypeData;
  workedTechnologies: ListModel[] = WorkedTechnologiesData;

  /**
   * Lists for employee types and technologies.
   */
  selectedEmpType: string = '';
  selectedworkedTechnologies: string[] = [];

  // Form control for search input
  searchControl = new FormControl();

  /**
   * DataSource for the MatTable used to display employees with pagination.
   */
  dataSource!: MatTableDataSource<any>;
  displayedColumns: string[] = ['image', 'name', 'email', 'city', 'experience', 'emp_type', 'worked_technologies', 'status'];

  /**
   * Constructor to initialize the store, state selectors, and other necessary services.
   * @param snackBarService - Service to display snack bar notifications
   * @param store - NgRx Store to manage the application state
   */
  constructor(
    private snackBarService: SnackBarService,
    private store: Store<AppState>
  ) {
    this.employees$ = this.store.select(selectGetEmployees);
    this.loading$ = this.store.select(selectGetEmployeesLoading);
    this.filteredEmployees$ = this.store.select(selectGetEmployees);
    this.searchEmployees$ = this.store.select(selectGetEmployees);
  }

  ngOnInit(): void {
    this.loadAllEmployees();

    // Debounce search input and trigger employee search on change
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
   * Loads all employees and sets up the data source for the employee table.
   */
  loadAllEmployees() {
    this.store.dispatch(getEmployees());
    this.employees$.pipe(takeUntil(this.destroy$)).subscribe((employees) => {
      this.dataSource = new MatTableDataSource<any>(employees);
      this.dataSource.paginator = this.paginator;
    })
  }

  /**
   * Applies the filters for employee type and technologies and updates the displayed employees.
   */
  onApplyFilters() {
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
   * Handles the input change in the search bar and triggers search.
   * @param event - The input event from the search bar
   */
  onSearch(event: any) {
    this.selectedEmpType = '';
    this.selectedworkedTechnologies = [];
    const value = event.target.value;
    this.searchControl.setValue(value);
  }

  /**
   * Clears all applied filters and reloads the full employee list.
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
