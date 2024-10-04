import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageEmployeesComponent } from './manage-employees.component';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MockEmployeesData } from 'src/app/shared/mock-data/employees-mock.data';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EmployeeService } from 'src/app/services/employee.service';
import { environment } from 'src/environment/environment';
import { IUpdateEmployeeResponse } from 'src/app/models/employee.model';

describe('ManageEmployeesComponent', () => {
  let component: ManageEmployeesComponent;
  let fixture: ComponentFixture<ManageEmployeesComponent>;
  let storeMock: any;
  let employeeService: EmployeeService;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    // Mock Store for NgRx
    storeMock = {
      dispatch: jasmine.createSpy('dispatch'),
      select: jasmine.createSpy('select').and.returnValue(of([]))
    };

    await TestBed.configureTestingModule({
      imports: [
        ManageEmployeesComponent,
        BrowserAnimationsModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: Store, useValue: storeMock }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ManageEmployeesComponent);
    component = fixture.componentInstance;
    employeeService = TestBed.inject(EmployeeService);
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(employeeService).toBeTruthy();
  });

  it('should get all the employees', () => {
    employeeService.getEmployees().subscribe((employees) => {
      expect(employees).toBeTruthy();
      expect(employees.length).toBe(3);
    });
    const mockReq = httpTestingController.expectOne(`${environment.api_url}/employee`);
    expect(mockReq.request.method).toEqual('GET');
    mockReq.flush(MockEmployeesData);
  });

  it('should update the employee', () => {
    let changes = { status: 'Inactive' };

    employeeService.updateEmployeeData('66fbb0a54af047238f8fe38a', changes).subscribe((res: IUpdateEmployeeResponse) => {
      expect(res?.employee).toBeTruthy();
    });

    const mockReq = httpTestingController.expectOne(`${environment.api_url}/employee/66fbb0a54af047238f8fe38a`);
    expect(mockReq.request.method).toEqual('PUT');

    let updatedEmp = {
      employee: {
        ...MockEmployeesData[2],
        status: 'Inactive'
      }
    };

    expect(mockReq.request.body.status).toEqual(changes.status);
    mockReq.flush(updatedEmp);
  });

  afterEach(() => {
    httpTestingController.verify();
  });
});

