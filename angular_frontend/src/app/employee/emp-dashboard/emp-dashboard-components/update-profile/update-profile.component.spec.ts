import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MockEmployeesData } from 'src/app/shared/mock-data/employees-mock.data';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EmployeeService } from 'src/app/services/employee.service';
import { UpdateProfileComponent } from './update-profile.component';
import { AuthService } from 'src/app/services/auth.service';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { environment } from 'src/environment/environment';
import { IUpdateEmployeeResponse } from 'src/app/models/employee.model';

describe('UpdateProfileComponent', () => {
  let fixture: ComponentFixture<UpdateProfileComponent>;
  let component: UpdateProfileComponent;
  let storeMock: any;
  let employeeService: EmployeeService;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    const authServiceMock = jasmine.createSpyObj('AuthService', ['getUserIdFromToken']);
    authServiceMock.getUserIdFromToken.and.returnValue('66fbb0a54af047238f8fe38a');

    // Mock Store for NgRx
    storeMock = {
      dispatch: jasmine.createSpy('dispatch'),
      select: jasmine.createSpy('select').and.returnValue(of({}))
    };

    await TestBed.configureTestingModule({
      imports: [
        UpdateProfileComponent,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        DemoMaterialModule
      ],
      providers: [
        { provide: Store, useValue: storeMock },
        { provide: AuthService, useValue: authServiceMock }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(UpdateProfileComponent);
    component = fixture.componentInstance;
    employeeService = TestBed.inject(EmployeeService);
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(employeeService).toBeTruthy();
  });

  it('should update the employee', () => {
    let changes = {
      contact: "9652418596",
      address: "123 Maple St, IL",
      experience: 3
    };

    employeeService.updateEmployeeData('66fbb0a54af047238f8fe38a', changes).subscribe((res: IUpdateEmployeeResponse) => {
      expect(res?.employee).toBeTruthy();
    });

    const mockReq = httpTestingController.expectOne(`${environment.api_url}/employee/66fbb0a54af047238f8fe38a`);
    expect(mockReq.request.method).toEqual('PUT');

    let updatedEmp = {
      employee: {
        ...MockEmployeesData[2],
        contact: "9652418596",
        address: "123 Maple St, IL",
        experience: 3
      }
    };

    expect(mockReq.request.body).toEqual(changes);
    mockReq.flush(updatedEmp);
  });

  afterEach(() => {
    httpTestingController.verify();
  });
});
