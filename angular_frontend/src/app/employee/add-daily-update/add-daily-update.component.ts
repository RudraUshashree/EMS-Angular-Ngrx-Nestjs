import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProjectTypeData } from 'src/app/shared/data/project-type';

@Component({
  selector: 'app-add-daily-update',
  standalone: true,
  imports: [
    DemoMaterialModule,
    SharedModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './add-daily-update.component.html',
  styleUrl: './add-daily-update.component.scss'
})
export class AddDailyUpdateComponent {

  projectTypeList = ProjectTypeData;

  /**
  * Form of adding project information.
  */
  addDailyUpdateForm: FormGroup = new FormGroup({
    work: new FormControl('Learning'),
    project_type: new FormControl(''),
    project: new FormControl([]),
    skill_title: new FormControl(''),
    hours: new FormControl(0, [Validators.required, Validators.min(1)]),
    update_content: new FormControl('', Validators.required)
  });

  constructor(
    public dialogRef: MatDialogRef<AddDailyUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void { }

  onNoClick() {
    this.dialogRef.close();
  }

  onSaveClick() {
    this.dialogRef.close(this.addDailyUpdateForm.value);
  }
}
