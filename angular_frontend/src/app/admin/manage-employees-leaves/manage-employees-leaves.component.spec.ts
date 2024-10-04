import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from 'src/environment/environment';
import { ManageEmployeesLeavesComponent } from './manage-employees-leaves.component';
import { LeavesService } from 'src/app/services/leaves.service';
import { MockEmpsLeavesData } from 'src/app/shared/mock-data/emps-leaves-mock.data';
import { ILeave, IUpdateEmployeeLeaveStatusPayload, IUpdateEmployeeLeaveStatusResponse } from 'src/app/models/leaves.model';

describe('ManageEmployeesLeavesComponent', () => {
  let component: ManageEmployeesLeavesComponent;
  let fixture: ComponentFixture<ManageEmployeesLeavesComponent>;
  let storeMock: any;
  let leavesService: LeavesService;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    // Mock Store for NgRx
    storeMock = {
      dispatch: jasmine.createSpy('dispatch'),
      select: jasmine.createSpy('select').and.returnValue(of([]))
    };

    await TestBed.configureTestingModule({
      imports: [
        ManageEmployeesLeavesComponent,
        BrowserAnimationsModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: Store, useValue: storeMock }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ManageEmployeesLeavesComponent);
    component = fixture.componentInstance;
    leavesService = TestBed.inject(LeavesService);
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(leavesService).toBeTruthy();
  });

  it('should get all the employees Leaves', () => {
    leavesService.getAllEmployeesLeaves().subscribe((leaves) => {
      expect(leaves).toBeTruthy();
    });
    const mockReq = httpTestingController.expectOne(`${environment.api_url}/leaves`);
    expect(mockReq.request.method).toEqual('GET');
    mockReq.flush(MockEmpsLeavesData);
  });

  it('should update the leave status of employee', () => {
    let leavePayload: IUpdateEmployeeLeaveStatusPayload = {
      empId: '66fbb0a54af047238f8fe38a',
      noOfLeaves: '2',
      leave_status: 'Approved'
    };

    leavesService.updateEmployeeLeaveStatus('66fbc1b34a4c93a032d94618', leavePayload).subscribe(
      (res: IUpdateEmployeeLeaveStatusResponse) => {
        expect(res?.leave).toBeTruthy();
      },
      (error) => {
        console.error('Error during leave status update:', error);
      }
    );

    const mockReq = httpTestingController.expectOne(`${environment.api_url}/leaves/66fbc1b34a4c93a032d94618`);
    expect(mockReq.request.method).toEqual('PUT');

    let updatedLeave = {
      leave: {
        ...MockEmpsLeavesData[2],
        leave_status: 'Approved'
      }
    };

    expect(mockReq.request.body.leave_status).toEqual(leavePayload.leave_status);
    mockReq.flush(updatedLeave);
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


