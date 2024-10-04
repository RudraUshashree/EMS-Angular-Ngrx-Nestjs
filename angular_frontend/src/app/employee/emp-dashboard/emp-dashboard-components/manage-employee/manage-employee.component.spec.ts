import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MockEmployeesData } from 'src/app/shared/mock-data/employees-mock.data';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EmployeeService } from 'src/app/services/employee.service';
import { environment } from 'src/environment/environment';
import { IEmployee } from 'src/app/models/employee.model';
import { ManageEmployeeComponent } from './manage-employee.component';

describe('ManageEmployeeComponent', () => {
  let component: ManageEmployeeComponent;
  let fixture: ComponentFixture<ManageEmployeeComponent>;
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
        ManageEmployeeComponent,
        BrowserAnimationsModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: Store, useValue: storeMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageEmployeeComponent);
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


  it('should get filtered employees based on the emp type and emp worked technologies', () => {
    let employeeType = 'Full_Stack';
    let workedTechnologies = ['React', 'Python', 'Nestjs'];

    employeeService.filterEmployees(employeeType, workedTechnologies).subscribe((res: IEmployee[]) => {
        expect(res).toBeTruthy();
        if (res) {
          expect(res.length).toBeGreaterThan(0);
        }
      },
      (error) => {
        console.error('Error during employees filtering:', error);
      }
    );

    const mockReq = httpTestingController.expectOne(`${environment.api_url}/employee/filter?employeeType=${employeeType}&workedTechnologies=${workedTechnologies}`);
    expect(mockReq.request.method).toEqual('GET');

    const mockEmpData: IEmployee[] = MockEmployeesData;
    mockReq.flush(mockEmpData);
  });

  afterEach(()=> {
    httpTestingController.verify();
  });
});
