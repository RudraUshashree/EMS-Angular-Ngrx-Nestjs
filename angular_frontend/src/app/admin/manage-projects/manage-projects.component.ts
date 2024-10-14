import { CommonModule, NgIf } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { IEmployee } from 'src/app/models/employee.model';
import { IAddProjectPayload, IAddProjectResponse, IProject } from 'src/app/models/project.model';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { SpinnerComponent } from 'src/app/shared/spinner.component';
import { getEmployees } from 'src/app/store/employee/actions';
import { selectGetEmployees } from 'src/app/store/employee/selectors';
import { addProject, getProjects, updateProject } from 'src/app/store/project/actions';
import { selectAddProject, selectProjects, selectProjectsLoading } from 'src/app/store/project/selectors';
import { AppState } from 'src/app/store/reducer';

@Component({
  selector: 'app-manage-projects',
  standalone: true,
  imports: [
    DemoMaterialModule,
    ReactiveFormsModule,
    SharedModule,
    NgIf,
    CommonModule,
    SpinnerComponent
  ],
  templateUrl: './manage-projects.component.html',
  styleUrl: './manage-projects.component.scss'
})
export class ManageProjectsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  /**
   * Observable to handle adding project response, project and loading.
   */
  private destroy$ = new Subject<void>()
  addProject$: Observable<IAddProjectResponse | null>;
  projects$: Observable<IProject[]>;
  loading$: Observable<boolean>;
  employees$: Observable<IEmployee[] | []>;

  /**
   * Used to manage selected tab index in the manage-projects and the currently selected project for updates.
   */
  selectedTabIndex: number = 0;
  selectedProject!: IProject;
  employees: IEmployee[] = [];
  addProjectFormShow: boolean = false;

  /**
   * DataSource for the MatTable used to display projects with pagination.
   */
  dataSource!: MatTableDataSource<any>;
  displayedColumns: string[] = ['createdAt', 'title', 'description', 'technologies', 'client_name', 'hours', 'price', 'emp'];

  /**
   * Form of updating project information.
   */
  projectForm: FormGroup = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    technologies: new FormControl('', Validators.required),
    client_name: new FormControl('', Validators.required),
    hours: new FormControl(0, [Validators.required, Validators.min(1)]),
    price: new FormControl(0, [Validators.required, Validators.min(1)]),
    emp: new FormControl([])
  });

  /**
   * Form of adding project information.
   */
  addProjectForm: FormGroup = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    technologies: new FormControl('', Validators.required),
    client_name: new FormControl('', Validators.required),
    hours: new FormControl(0, [Validators.required, Validators.min(1)]),
    price: new FormControl(0, [Validators.required, Validators.min(1)]),
    emp: new FormControl([])
  });

  constructor(
    private snackBarService: SnackBarService,
    private store: Store<AppState>
  ) {
    this.addProject$ = this.store.select(selectAddProject);
    this.projects$ = this.store.select(selectProjects);
    this.loading$ = this.store.select(selectProjectsLoading);
    this.employees$ = this.store.select(selectGetEmployees);
  }

  ngOnInit(): void {
    this.onLoadAllEmployees();
    this.onLoadProjects();
  }

  /**
  * Dispatches an action to load all projects.
  */
  onLoadProjects() {
    this.store.dispatch(getProjects());
    this.projects$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (projects: IProject[]) => {
        this.dataSource = new MatTableDataSource<any>(projects);
        this.dataSource.paginator = this.paginator;
      },
      error: (error) => {
        const errorMsg = error?.error?.message;
        this.snackBarService.openAlert({ message: errorMsg, type: "error" })
      }
    })
  }

  getEmployeeNames(emp: IEmployee[]): string {
    return emp?.map(data => data.name).join(', ') || '-';
  }

  /**
   * Loads all employees from the store and updates the dataSource for the table.
   */
  onLoadAllEmployees() {
    this.store.dispatch(getEmployees());
    this.employees$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (employees) => {
        this.employees = employees;
        console.log('emp: ', this.employees);
      }
    })
  }

  /**
   * Handles row click event and sets the selected project details for updating.
   * @param data - Project data for the clicked row
   */
  onRowClicked(data: IProject) {
    this.selectedTabIndex = 1;
    this.selectedProject = data;
    let empData: any = data.emp;

    const emp = this.employees.filter(employees =>
      empData.some((emp: any) => emp._id === employees._id)
    );

    const employeeIds = emp.map(employee => employee._id);

    this.projectForm = new FormGroup({
      title: new FormControl(data['title'] ?? '', Validators.required),
      description: new FormControl(data['description'] ?? '', Validators.required),
      technologies: new FormControl(data['technologies'] ?? '', Validators.required),
      client_name: new FormControl(data['client_name'] ?? '', Validators.required),
      hours: new FormControl(data['hours'] ?? '', [Validators.required, Validators.min(1)]),
      price: new FormControl(data['price'] ?? '', [Validators.required, Validators.min(1)]),
      emp: new FormControl(employeeIds)
    });
  }

  onAddProjectButtonClick() {
    this.addProjectFormShow = true;
  }

  onCloseButtonClick() {
    this.addProjectFormShow = false;
  }

  onAddProject() {
    const payload: IAddProjectPayload = this.addProjectForm.value;
    this.store.dispatch(addProject({ payload: payload }));
    this.projects$.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.addProjectFormShow = false;
      }
    })
  }

  onUpdateProject() {
    if (this.selectedProject) {
      let updatedValues: any = {};

      // Loop over the controls and check if they are dirty
      Object.keys(this.projectForm.controls).forEach(key => {
        const control = this.projectForm.get(key);

        // Check if the control is dirty (value has changed)
        if (control?.dirty) {
          updatedValues[key] = control.value;
        }
      });

      this.store.dispatch(updateProject({ id: this.selectedProject?._id, payload: updatedValues }));
      this.projects$.pipe(takeUntil(this.destroy$)).subscribe({
        next: () => {
          this.selectedTabIndex = 0;
        },
        error: () => {
          this.selectedTabIndex = 1;
        }
      })
    }
  }
}
