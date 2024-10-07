import { Model } from 'mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { LeaveService } from './leaves.service';
import { LeaveMockData } from './../mock-data/leaves-mock.data';
import { Employee } from 'src/schemas/employee.schema';
import { Leave } from 'src/schemas/leaves.schema';

const mockLeaveModel = {
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndDelete: jest.fn(),
};

const mockEmployeeModel = {
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
};

let employeeModel: Model<Employee>;
let leaveModel: Model<Leave>;

describe('LeaveService', () => {
    let leaveService: LeaveService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                LeaveService,
                {
                    provide: getModelToken('Leave'),
                    useValue: mockLeaveModel,
                },
                {
                    provide: getModelToken('Employee'),
                    useValue: mockEmployeeModel,
                },
            ],
        }).compile();

        leaveService = module.get<LeaveService>(LeaveService);
        leaveModel = module.get(getModelToken('Leave'));
        employeeModel = module.get(getModelToken('Employee'));
    });

    describe('getAllEmployeesLeaves', () => {
        it('should retrieve all leave records successfully', async () => {

            mockLeaveModel.find.mockReturnValue({
                sort: jest.fn().mockResolvedValue(LeaveMockData),
            });

            const result = await leaveService.getAllEmployeesLeaves();

            expect(mockLeaveModel.find).toHaveBeenCalled();
            expect(result).toEqual(LeaveMockData);
        });

        it('should throw InternalServerErrorException if an error occurs', async () => {
            mockLeaveModel.find.mockImplementation(() => {
                throw new Error('Some error');
            });

            await expect(leaveService.getAllEmployeesLeaves()).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('getEmployeeLeaves', () => {
        const empId = '66ffe4c2be7bc8770d78d426';

        it('should retrieve employee leave records and balance successfully', async () => {
            const mockEmpLeaves = [
                LeaveMockData[0],
                LeaveMockData[1]
            ];
            const mockEmployee = { _id: empId, balanced_leaves: 10 };

            mockLeaveModel.find.mockResolvedValueOnce(mockEmpLeaves);
            mockEmployeeModel.findById.mockResolvedValueOnce(mockEmployee);

            const result = await leaveService.getEmployeeLeaves(empId);

            expect(mockLeaveModel.find).toHaveBeenCalledWith({ emp: empId });
            expect(mockEmployeeModel.findById).toHaveBeenCalledWith(empId);

            expect(result).toEqual({
                leaves: mockEmpLeaves,
                balanced_leaves: mockEmployee.balanced_leaves,
            });
        });

        it('should return null for leaves if no leave records found', async () => {
            const mockEmployee = { _id: empId, balanced_leaves: 10 };

            mockLeaveModel.find.mockResolvedValueOnce([]);
            mockEmployeeModel.findById.mockResolvedValueOnce(mockEmployee);

            const result = await leaveService.getEmployeeLeaves(empId);

            expect(mockLeaveModel.find).toHaveBeenCalledWith({ emp: empId });
            expect(mockEmployeeModel.findById).toHaveBeenCalledWith(empId);

            expect(result).toEqual({
                leaves: null,
                balanced_leaves: mockEmployee.balanced_leaves,
            });
        });

        it('should throw an InternalServerErrorException on error', async () => {
            mockLeaveModel.find.mockImplementationOnce(() => {
                throw new Error('Some error');
            });

            await expect(leaveService.getEmployeeLeaves(empId)).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('deleteEmployeeLeave', () => {
        const mockEmployee = {
            _id: 'empId123',
            balanced_leaves: 10
        };

        const mockLeave = {
            _id: 'leaveId123',
            emp: 'empId123'
        };

        beforeEach(async () => {
            const module = await Test.createTestingModule({
                providers: [
                    LeaveService,
                    {
                        provide: getModelToken('Leave'),
                        useValue: {
                            findByIdAndDelete: jest.fn(),
                        },
                    },
                    {
                        provide: getModelToken('Employee'),
                        useValue: {
                            findById: jest.fn(),
                            findByIdAndUpdate: jest.fn(),
                        },
                    },
                ],
            }).compile();
        });

        it('should delete a leave and update the employee balance', async () => {
            mockLeaveModel.findByIdAndDelete.mockResolvedValue(mockLeave);
            mockEmployeeModel.findById.mockResolvedValue(mockEmployee);
            mockEmployeeModel.findByIdAndUpdate.mockResolvedValue({ ...mockEmployee, balanced_leaves: 15 });

            const result = await leaveService.deleteEmployeeLeave('empId123', 'leaveId123', 5);

            expect(leaveModel.findByIdAndDelete).toHaveBeenCalledWith('leaveId123');
            expect(employeeModel.findById).toHaveBeenCalledWith('empId123');
            expect(employeeModel.findByIdAndUpdate).toHaveBeenCalledWith(
                'empId123',
                { $set: { balanced_leaves: 15 } },
                { new: true, runValidators: true }
            );
            expect(result).toEqual({
                message: 'Leave Deleted Successfully',
                balanced_leaves: 15,
                leaveId: 'leaveId123',
            });
        });

        it('should throw NotFoundException if leave is not found', async () => {
            mockLeaveModel.findByIdAndDelete.mockResolvedValue(null);

            await expect(leaveService.deleteEmployeeLeave('empId123', 'invalidLeaveId', 5)).rejects.toThrow(NotFoundException);
            expect(leaveModel.findByIdAndDelete).toHaveBeenCalledWith('invalidLeaveId');
        });

        it('should throw InternalServerErrorException on internal error', async () => {
            mockLeaveModel.findByIdAndDelete.mockRejectedValue(new Error('Internal error'));

            await expect(leaveService.deleteEmployeeLeave('empId123', 'leaveId123', 5)).rejects.toThrow(
                InternalServerErrorException
            );
            expect(leaveModel.findByIdAndDelete).toHaveBeenCalledWith('leaveId123');
        });
    });

    describe('filterEmployeesLeaves', () => {
        it('should filter leave records by leave type', async () => {
            const leaveType = 'sick';
            const filteredLeaves = LeaveMockData.filter(leave => leave.leaves_type === leaveType);

            mockLeaveModel.find.mockReturnValue({
                exec: jest.fn().mockResolvedValue(filteredLeaves),
            });

            const result = await leaveService.filterEmployeesLeaves(leaveType);

            expect(mockLeaveModel.find).toHaveBeenCalledWith({ leaves_type: leaveType });
            expect(result).toEqual(filteredLeaves);
        });

        it('should filter leave records by leave status', async () => {
            const leaveStatus = 'approved';
            const filteredLeaves = LeaveMockData.filter(leave => leave.leave_status === leaveStatus);

            mockLeaveModel.find.mockReturnValue({
                exec: jest.fn().mockResolvedValue(filteredLeaves),
            });

            const result = await leaveService.filterEmployeesLeaves(undefined, leaveStatus);

            expect(leaveModel.find).toHaveBeenCalledWith({ leave_status: leaveStatus });
            expect(result).toEqual(filteredLeaves);
        });

        it('should filter leave records by both leave type and leave status', async () => {
            const leaveType = 'sick';
            const leaveStatus = 'approved';
            const filteredLeaves = LeaveMockData.filter(
                leave => leave.leaves_type === leaveType && leave.leave_status === leaveStatus
            );

            mockLeaveModel.find.mockReturnValue({
                exec: jest.fn().mockResolvedValue(filteredLeaves),
            });

            const result = await leaveService.filterEmployeesLeaves(leaveType, leaveStatus);

            expect(leaveModel.find).toHaveBeenCalledWith({
                leaves_type: leaveType,
                leave_status: leaveStatus,
            });
            expect(result).toEqual(filteredLeaves);
        });
    });


    describe('filterOneEmployeeLeaves', () => {
        const empId = 'someEmployeeId';
        const leaveType = 'sick';

        it('should filter leave records for a specific employee by leave type', async () => {
            mockLeaveModel.find.mockReturnValue({
                exec: jest.fn().mockResolvedValue(LeaveMockData), // Mock the result
            });

            const result = await leaveService.filterOneEmployeeLeaves(empId, leaveType);

            expect(leaveModel.find).toHaveBeenCalledWith({ emp: empId, leaves_type: leaveType });
            expect(result).toEqual(LeaveMockData);
        });

        it('should throw InternalServerErrorException if an error occurs', async () => {
            mockLeaveModel.find.mockImplementation(() => {
                throw new Error('Some error');
            });

            await expect(leaveService.getAllEmployeesLeaves()).rejects.toThrow(InternalServerErrorException);
        });
    });

});
