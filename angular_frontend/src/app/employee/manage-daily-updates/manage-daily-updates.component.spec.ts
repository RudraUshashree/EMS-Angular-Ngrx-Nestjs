import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageDailyUpdatesComponent } from './manage-daily-updates.component';

describe('ManageDailyUpdatesComponent', () => {
  let component: ManageDailyUpdatesComponent;
  let fixture: ComponentFixture<ManageDailyUpdatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageDailyUpdatesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageDailyUpdatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
