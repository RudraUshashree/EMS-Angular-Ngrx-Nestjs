import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { IDailyUpdate } from 'src/app/models/daily-updates.model';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-employee-daily-updates-table',
  standalone: true,
  imports: [
    DemoMaterialModule,
    SharedModule,
    CommonModule
  ],
  templateUrl: './employee-daily-updates-table.component.html',
  styleUrl: './employee-daily-updates-table.component.scss'
})
export class EmployeeDailyUpdatesTableComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Input() updates: IDailyUpdate[] = [];

  displayedColumns: string[] = ['createdAt', 'emp', 'work', 'project_type', 'project', 'skill_title', 'hours', 'update_content'];
  dataSource = new MatTableDataSource<IDailyUpdate>();

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['updates']) {
      this.dataSource.data = this.updates;
    }
  }
}
