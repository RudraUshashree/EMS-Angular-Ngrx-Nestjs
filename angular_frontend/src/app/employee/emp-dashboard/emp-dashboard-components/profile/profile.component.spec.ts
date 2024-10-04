import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { ProfileComponent } from './profile.component';
import { By } from '@angular/platform-browser';
import { EmployeeDashboardComponent } from '../../emp-dashboard.component';
import { MockEmployeesData } from 'src/app/shared/mock-data/employees-mock.data';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { AuthService } from 'src/app/services/auth.service';

describe('ProfileComponent', () => {
  let fixture: ComponentFixture<EmployeeDashboardComponent>;
  let employeeDashboardComponent: EmployeeDashboardComponent;
  let storeMock: any;

  beforeEach(async () => {
    const authServiceMock = jasmine.createSpyObj('AuthService', ['getUserIdFromToken']);
    authServiceMock.getUserIdFromToken.and.returnValue('66fbb0a54af047238f8fe38a');

    // Mock Store for NgRx
    storeMock = {
      dispatch: jasmine.createSpy('dispatch'),
      select: jasmine.createSpy('select').and.returnValue(of([]))
    };

    await TestBed.configureTestingModule({
      imports: [
        ProfileComponent,
        EmployeeDashboardComponent,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        DemoMaterialModule
      ],
      providers: [
        { provide: Store, useValue: storeMock },
        { provide: AuthService, useValue: authServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeDashboardComponent);
    employeeDashboardComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should pass employee data from EmployeeDashboardComponent to ProfileComponent', fakeAsync(() => {
    const mockEmployeeData = MockEmployeesData[0];
    employeeDashboardComponent.employee$ = of(mockEmployeeData);
    fixture.detectChanges();

    const profileComponentElement = fixture.debugElement.query(By.directive(ProfileComponent)).nativeElement;

    if (profileComponentElement) {
      const nameElement = profileComponentElement.querySelector('#employee-name');
      console.log(nameElement.textContent);
      if (nameElement) {
        expect(nameElement.textContent).toContain(mockEmployeeData.name);
      } else {
        fail('Name element not found');
      }
    }
  }))
});
