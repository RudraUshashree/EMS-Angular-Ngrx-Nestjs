import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit, signal, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Observable, Subject, take } from 'rxjs';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { ListModel } from '../../models/list-model';
import { WorkTypeData } from '../../shared/data/work-type.data';
import { EmployeeTypeData } from '../../shared/data/employee-type.data';
import { WorkedTechnologiesData } from '../../shared/data/worked-technologies.data';
import { selectAuthSignupSuccess } from 'src/app/store/auth/selectors';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/reducer';
import { signup } from 'src/app/store/auth/actions';
import { SpinnerComponent } from 'src/app/shared/spinner.component';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    DemoMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    RouterModule,
    NgFor,
    SpinnerComponent,
    CommonModule
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class SignUpComponent implements OnInit, OnDestroy {

  // Observable to track if the sign-up process was successful
  private destroy$: Subject<void> = new Subject<void>();
  signupSuccess$: Observable<boolean>;

  // Lists of work types, employee types, and technologies for the form dropdowns
  workTypeList: ListModel[] = WorkTypeData;
  empTypeList: ListModel[] = EmployeeTypeData;
  workedTechnologies: ListModel[] = WorkedTechnologiesData;

  // File variables to manage profile image upload
  file_store!: File | null;
  selectedFile: File | null = null;
  imagePreview: string | null = null;


  /**
   * Constructor to initialize the store and setup selectors for sign-up success.
   * @param router - Angular Router for navigation
   * @param store - NgRx Store for dispatching actions and selecting state
   */
  constructor(
    private router: Router,
    private store: Store<AppState>
  ) {
    this.signupSuccess$ = this.store.select(selectAuthSignupSuccess);
  }

  ngOnInit(): void { }

  employeeSignUpForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(4)]),
    dob: new FormControl('', [Validators.required]),
    contact: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{10}$')]),
    address: new FormControl('', [Validators.required]),
    city: new FormControl(''),
    zipcode: new FormControl('', [Validators.pattern('^[0-9]{5,6}$')]),
    emp_type: new FormControl('', [Validators.required]),
    work_type: new FormControl('', [Validators.required]),
    experience: new FormControl('', [Validators.required, Validators.min(0)]),
    salary: new FormControl('', [Validators.required, Validators.min(0)]),
    doj: new FormControl('', [Validators.required]),
    worked_technologies: new FormControl('', [Validators.required]),
    image: new FormControl('', [Validators.required]),
  });

  // For Password Eye Icon Button
  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  /**
   * Handles the sign-up process by dispatching the signup action with the form data.
   * It also handles image file upload.
   */
  onSignUp() {
    const employeeData: any = this.employeeSignUpForm.value;
    const fd = new FormData();

    // Append form data
    Object.keys(employeeData).forEach(key => {
      if (key === "image" && this.selectedFile) {
        fd.append("files", this.selectedFile);
      } else {
        fd.append(key, employeeData[key]);
      }
    });

    const payload = fd;

    this.store.dispatch(signup({ payload }));

    this.signupSuccess$.pipe(take(2)).subscribe((success) => {
      if (success) {
        this.router.navigate(["auth/signin"]);
      }
    })
  }

  /**
   * Handles file input change, stores the selected file, and generates an image preview.
   * @param event - The file input change event
   */
  onFileChange(event: any): void {
    const file: File = event.target.files[0];

    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
