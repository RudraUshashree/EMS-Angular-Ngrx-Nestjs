import { Model } from 'mongoose';
import { Test, TestingModule } from "@nestjs/testing";
import { EmployeeService } from "./employee.service";
import { getModelToken } from "@nestjs/mongoose";
import { Employee } from "../schemas/employee.schema";
import { EmployeeMockData } from '../mock-data/employee-mock.data';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { Emp_Type } from '../constants/emp-type.constants';
import { Work_Type } from '../constants/work_type.constants';

describe('EmployeeService', () => {

    let employeeService: EmployeeService;
    let employeeModel: Model<Employee>;

    const mockEmployeeModel = {
        findById: jest.fn(),
        find: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
        findByIdAndUpdate: jest.fn()
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                EmployeeService,
                {
                    provide: getModelToken(Employee.name),
                    useValue: mockEmployeeModel
                }
            ]
        }).compile()

        employeeService = module.get<EmployeeService>(EmployeeService);
        employeeModel = module.get<Model<Employee>>(getModelToken(Employee.name));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllEmployees', () => {

        it('should return a list of employees with photoUrl added', async () => {
            const mockLean = jest.fn().mockResolvedValue(EmployeeMockData);
            mockEmployeeModel.find.mockReturnValue({ lean: mockLean });

            const result = await employeeService.getAllEmployees();

            expect(employeeModel.find).toHaveBeenCalled();
            expect(result).toEqual(
                EmployeeMockData.map(employee => ({
                    ...employee,
                    photoUrl: `http://localhost:3000/${employee.image}`,
                }))
            );
        });

        it('should throw BadRequestException if an error occurs', async () => {
            jest.spyOn(employeeModel, 'find').mockReturnValue({
                lean: jest.fn().mockReturnThis(),
                exec: jest.fn().mockRejectedValue(new Error('Validation Error')),
            } as any);

            await expect(employeeService.getAllEmployees()).rejects.toThrow(BadRequestException);
        });
    });

    describe('getEmployee', () => {

        it("should find and return an employee by id with photoUrl", async () => {
            const mockLean = jest.fn().mockResolvedValue(EmployeeMockData[0]);
            mockEmployeeModel.findById.mockReturnValue({ lean: mockLean });

            const result = await employeeService.getEmployee(EmployeeMockData[0]._id);

            expect(employeeModel.findById).toHaveBeenCalledWith(EmployeeMockData[0]._id);
            expect(mockLean).toHaveBeenCalled();

            const expectedEmployee = {
                ...EmployeeMockData[0],
                photoUrl: `http://localhost:3000/${EmployeeMockData[0].image}`
            };

            expect(result).toEqual(expectedEmployee);
        });

        it("should throw NotFoundException if employee is not found", async () => {
            const mockLean = jest.fn().mockResolvedValue(null);
            mockEmployeeModel.findById.mockReturnValue({ lean: mockLean });

            await expect(employeeService.getEmployee('nonexistent-id')).rejects.toThrow(NotFoundException);
            expect(employeeModel.findById).toHaveBeenCalledWith('nonexistent-id');
            expect(mockLean).toHaveBeenCalled();
        });
    })

    describe('searchEmployee', () => {
        it('should return a list of employees matching the search term', async () => {
            const mockSearchedEmployees = [
                EmployeeMockData[0],
                EmployeeMockData[5]
            ];

            const regex = new RegExp('M', 'i');

            const mockExec = jest.fn().mockResolvedValue(mockSearchedEmployees);
            const mockLean = jest.fn().mockReturnValue({ exec: mockExec });
            const mockFind = jest.fn().mockReturnValue({ lean: mockLean });

            employeeModel.find = mockFind;

            const result = await employeeService.searchEmployee('M');

            expect(employeeModel.find).toHaveBeenCalledWith({ name: { $regex: regex } });
            expect(mockLean).toHaveBeenCalled();
            expect(mockExec).toHaveBeenCalled();
            expect(result).toEqual(mockSearchedEmployees.map(employee => ({
                ...employee,
                photoUrl: `http://localhost:3000/${employee.image}`
            })));
        });

        it('should throw NotFoundException if no employees found', async () => {
            const mockExec = jest.fn().mockResolvedValue([]);
            const mockLean = jest.fn().mockReturnValue({ exec: mockExec });
            const mockFind = jest.fn().mockReturnValue({ lean: mockLean });

            employeeModel.find = mockFind;

            await expect(employeeService.searchEmployee('NonExistingEmployee')).rejects.toThrow(NotFoundException);
        });

        it('should throw BadRequestException if an error occurs', async () => {
            const mockExec = jest.fn().mockRejectedValue(new Error('Some error'));
            const mockLean = jest.fn().mockReturnValue({ exec: mockExec });
            const mockFind = jest.fn().mockReturnValue({ lean: mockLean });

            employeeModel.find = mockFind;

            await expect(employeeService.searchEmployee('M')).rejects.toThrow(BadRequestException);
        });
    });

    describe('filterEmployees', () => {
        const mockFilteredEmployees = [
            EmployeeMockData[2],
            EmployeeMockData[4]
        ];

        beforeEach(() => {
            jest.clearAllMocks();
        });

        it('should return a list of employees filtered by employee type', async () => {
            const mockFind = jest.fn().mockReturnValue({
                lean: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(mockFilteredEmployees) })
            });
            employeeModel.find = mockFind;

            const result = await employeeService.filterEmployees('Designer');

            expect(mockFind).toHaveBeenCalledWith({ emp_type: 'Designer' });
            expect(result).toEqual(mockFilteredEmployees.map(employee => ({
                ...employee,
                photoUrl: `http://localhost:3000/${employee.image}`
            })));
        });

        it('should return a list of employees filtered by worked technologies', async () => {
            const mockFind = jest.fn().mockReturnValue({
                lean: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(mockFilteredEmployees) })
            });
            employeeModel.find = mockFind;

            const result = await employeeService.filterEmployees('', 'JavaScript');

            expect(mockFind).toHaveBeenCalledWith({
                worked_technologies: { $regex: expect.any(String), $options: 'i' }
            });

            const expectedResult = mockFilteredEmployees.map(employee => ({
                ...employee,
                photoUrl: `http://localhost:3000/${employee.image}`
            }));

            expect(result).toEqual(expectedResult);
        });

        it('should return a list of employees filtered by employee type and worked technologies', async () => {
            const mockFind = jest.fn().mockReturnValue({
                lean: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue([mockFilteredEmployees[1]]) })
            });
            employeeModel.find = mockFind;

            const result = await employeeService.filterEmployees('Designer', 'JavaScript');

            expect(mockFind).toHaveBeenCalledWith({
                emp_type: 'Designer',
                worked_technologies: { $regex: expect.any(String), $options: 'i' }
            });
            expect(result).toEqual([{ ...mockFilteredEmployees[1], photoUrl: `http://localhost:3000/${mockFilteredEmployees[1].image}` }]);
        });

        it('should throw BadRequestException if an error occurs', async () => {
            const mockFind = jest.fn().mockReturnValue({
                lean: jest.fn().mockReturnValue({ exec: jest.fn().mockRejectedValue(new Error('Some Error')) })
            });
            employeeModel.find = mockFind;

            await expect(employeeService.filterEmployees()).rejects.toThrow(BadRequestException);
        });
    });

    describe('addEmployee', () => {
        const addEmployeeDto = {
            "name": "test",
            "email": "test@gmail.com",
            "password": "nani123",
            "dob": new Date('2002-09-10'),
            "contact": "6685974256",
            "address": "Happy Glorious",
            "city": "surat",
            "zipcode": "395263",
            "experience": 3,
            "worked_technologies": "Python,React",
            "salary": 40000,
            "emp_type": Emp_Type.Full_Stack,
            "work_type": Work_Type.Work_From_Home,
            "doj": new Date('2024-10-01'),
            "image": ["img1.PNG"]
        }

        it('should return a conflict error if employee already exists', async () => {
            mockEmployeeModel.findOne.mockResolvedValueOnce(true);

            await expect(employeeService.addEmployee(addEmployeeDto)).rejects.toThrow(ConflictException);
            expect(employeeModel.findOne).toHaveBeenCalledWith({ email: addEmployeeDto.email });
        });

        it('should create a new employee successfully', async () => {
            mockEmployeeModel.findOne.mockResolvedValueOnce(null);
            mockEmployeeModel.create.mockResolvedValueOnce({ _id: '12345' });

            const result = await employeeService.addEmployee(addEmployeeDto);

            expect(result).toEqual({
                message: 'Employee signed up successfully.',
                employeeId: '12345'
            });
            expect(employeeModel.create).toHaveBeenCalledWith({
                ...addEmployeeDto,
                image: 'img1.PNG'
            });
        });
    });
})