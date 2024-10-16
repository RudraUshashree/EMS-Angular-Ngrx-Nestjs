import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { IDailyUpdatesResponse, Project } from 'src/app/models/daily-updates.model';
import { IProject } from 'src/app/models/project.model';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { ProjectTypeData } from 'src/app/shared/data/project-type';
import { SharedModule } from 'src/app/shared/shared.module';
import { updateDailyUpdate } from 'src/app/store/daily-update/actions';
import { selectUpdateDailyUpdate } from 'src/app/store/daily-update/selectors';
import { AppState } from 'src/app/store/reducer';

@Component({
  selector: 'app-update-daily-update',
  standalone: true,
  imports: [
    DemoMaterialModule,
    SharedModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './update-daily-update.component.html',
  styleUrl: './update-daily-update.component.scss'
})
export class UpdateDailyUpdateComponent {

  /**
  * Observable that contains the daily update response data.
  */
  private destroy$: Subject<void> = new Subject<void>();
  updateDailyUpdate$: Observable<IDailyUpdatesResponse | null>

  projectTypeList = ProjectTypeData;
  projectsList: Project[] = [];
  projects!: IProject[];

  /**
  * Form of adding project information.
  */
  updateDailyUpdateForm: FormGroup = new FormGroup({
    work: new FormControl('Learning'),
    project_type: new FormControl(''),
    project: new FormControl([]),
    skill_title: new FormControl(''),
    hours: new FormControl(0, [Validators.required, Validators.min(1)]),
    update_content: new FormControl('', Validators.required)
  });

  constructor(
    public dialogRef: MatDialogRef<UpdateDailyUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store<AppState>,
    private snackBarService: SnackBarService
  ) {
    this.updateDailyUpdate$ = this.store.select(selectUpdateDailyUpdate);
  }

  ngOnInit(): void {
    this.projects = this.data.projects
    let dailyUpdate = this.data.dailyUpdate;
    this.projectsList = dailyUpdate?.project;

    this.updateDailyUpdateForm = new FormGroup({
      work: new FormControl(dailyUpdate['work']),
      project_type: new FormControl(dailyUpdate['project_type']),
      project: new FormControl(this.projectsList[0]?._id),
      skill_title: new FormControl(dailyUpdate['skill_title']),
      hours: new FormControl(dailyUpdate['hours']),
      update_content: new FormControl(dailyUpdate['update_content'])
    });
  }

  onNoClick() {
    this.dialogRef.close();
  }

  onUpdateClick() {
    let updatedValues: any = {};

    // Loop over the controls and check if they are dirty
    Object.keys(this.updateDailyUpdateForm.controls).forEach(key => {
      const control = this.updateDailyUpdateForm.get(key);

      // Check if the control is dirty (value has changed)
      if (control?.dirty) {
        updatedValues[key] = control.value;
      }
    });
    this.store.dispatch(updateDailyUpdate({ id: this.data.dailyUpdate._id, payload: updatedValues }));

    this.updateDailyUpdate$.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.dialogRef.close();
      },
      error: (error) => {
        const errorMsg = error?.error?.message;
        this.snackBarService.openAlert({ message: errorMsg, type: "error" });
      }
    })
  }
}
