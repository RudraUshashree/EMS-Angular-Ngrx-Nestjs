import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeDailyUpdatesTableComponent } from './employee-daily-updates-table.component';

describe('EmployeeDailyUpdatesTableComponent', () => {
  let component: EmployeeDailyUpdatesTableComponent;
  let fixture: ComponentFixture<EmployeeDailyUpdatesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeDailyUpdatesTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmployeeDailyUpdatesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
