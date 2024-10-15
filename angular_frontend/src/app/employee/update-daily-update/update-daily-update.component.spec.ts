import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateDailyUpdateComponent } from './update-daily-update.component';

describe('UpdateDailyUpdateComponent', () => {
  let component: UpdateDailyUpdateComponent;
  let fixture: ComponentFixture<UpdateDailyUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateDailyUpdateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateDailyUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
