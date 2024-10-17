import { Component, inject, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { CommonModule, DatePipe, NgFor, NgIf } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WorkedTechnologiesData } from 'src/app/shared/data/worked-technologies.data';
import { EmployeeTypeData } from 'src/app/shared/data/employee-type.data';
import { ListModel } from 'src/app/models/list-model';
import { debounceTime, distinctUntilChanged, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { IEmployee } from 'src/app/models/employee.model';
import { selectGetEmployees, selectGetEmployeesLoading } from 'src/app/store/employee/selectors';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/reducer';
import { filterEmployees, getEmployees, searchEmployees } from 'src/app/store/employee/actions';
import { SpinnerComponent } from 'src/app/shared/spinner.component';
import { UpdateEmployeeStatusComponent } from './update-employee-status/update-employee-status.component';
import { MatDialog } from '@angular/material/dialog';

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
   * Observables for handling employees and loading states.
   */
  private destroy$ = new Subject<void>();
  employees$: Observable<IEmployee[] | []>;
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

  employees: IEmployee[] = [];
  dialog = inject(MatDialog);

  constructor(
    private store: Store<AppState>
  ) {
    this.employees$ = this.store.select(selectGetEmployees);
    this.loading$ = this.store.select(selectGetEmployeesLoading);
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
        return this.employees$;
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  openUpdateEmployeeStatusDialog(employee: IEmployee) {
    this.dialog.open(UpdateEmployeeStatusComponent, {
      width: '800px',
      data: { employee: employee }
    });
  }

  /**
   * Loads all employees from the store and updates the dataSource for the table.
   */
  loadAllEmployees() {
    this.store.dispatch(getEmployees());
    this.employees$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (employees) => {
        this.employees = employees;
      }
    })
  }

  /**
   * Applies filters based on selected employee type and worked technologies.
   */
  applyFilters() {
    if (this.selectedEmpType || this.selectedworkedTechnologies.length) {
      this.store.dispatch(filterEmployees({ employeeType: this.selectedEmpType, workedTechnologies: this.selectedworkedTechnologies }));
    }
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
