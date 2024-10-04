import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from 'src/environment/environment';
import { LeavesService } from 'src/app/services/leaves.service';
import { MockEmpsLeavesData } from 'src/app/shared/mock-data/emps-leaves-mock.data';
import { ILeave } from 'src/app/models/leaves.model';
import { ManageLeavesComponent } from './manage-leaves.component';
import { AuthService } from 'src/app/services/auth.service';

describe('ManageLeavesComponent', () => {
  let component: ManageLeavesComponent;
  let fixture: ComponentFixture<ManageLeavesComponent>;
  let storeMock: any;
  let leavesService: LeavesService;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    const authServiceMock = jasmine.createSpyObj('AuthService', ['getUserIdFromToken']);
    authServiceMock.getUserIdFromToken.and.returnValue('66fbb12b4af047238f8fe394');

    // Mock Store for NgRx
    storeMock = {
      dispatch: jasmine.createSpy('dispatch'),
      select: jasmine.createSpy('select').and.returnValue(of([]))
    };

    await TestBed.configureTestingModule({
      imports: [
        ManageLeavesComponent,
        BrowserAnimationsModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: Store, useValue: storeMock },
        { provide: AuthService, useValue: authServiceMock }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ManageLeavesComponent);
    component = fixture.componentInstance;
    leavesService = TestBed.inject(LeavesService);
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(leavesService).toBeTruthy();
  });

  it('should get all the employee Leaves', () => {
    let id = '66fbb12b4af047238f8fe394';
    leavesService.getEmployeeLeaves(id).subscribe((leaves) => {
      expect(leaves).toBeTruthy();
    });
    const mockReq = httpTestingController.expectOne(`${environment.api_url}/leaves/emp-leaves/${id}`);
    expect(mockReq.request.method).toEqual('GET');
    mockReq.flush(MockEmpsLeavesData);
  });

  it('should have an invalid form when empty', () => {
    expect(component.employeeLeaveForm.valid).toBeFalsy();
  });

  it('should validate form fields correctly', () => {
    const form = component.employeeLeaveForm;

    expect(form.get('leaves_type')?.valid).toBeFalsy();
    expect(form.get('reason')?.valid).toBeFalsy();
    expect(form.get('start_date')?.valid).toBeFalsy();
    expect(form.get('end_date')?.valid).toBeFalsy();

    form.get('leaves_type')?.setValue('SL');
    form.get('reason')?.setValue('Feeling unwell and need rest.');
    form.get('start_date')?.setValue('2024-10-10');
    form.get('end_date')?.setValue('2024-10-10');

    expect(form.valid).toBeTruthy();
  });

  it('should get filtered leaves based on the leave type and leave status', () => {
    let leaveType = 'CL';
    let leaveStatus = 'Pending';

    leavesService.filterEmployeesLeaves(leaveType, leaveStatus).subscribe((res: ILeave[]) => {
      expect(res).toBeTruthy();
      if (res) {
        expect(res.length).toBeGreaterThan(0);
      }
    },
      (error) => {
        console.error('Error during leave filtering:', error);
      }
    );

    const mockReq = httpTestingController.expectOne(`${environment.api_url}/leaves/filter?leaveType=${leaveType}&leaveStatus=${leaveStatus}`);
    expect(mockReq.request.method).toEqual('GET');

    const mockLeavesData: ILeave[] = MockEmpsLeavesData;
    mockReq.flush(mockLeavesData);
  });

  afterEach(() => {
    httpTestingController.verify();
  });
});
