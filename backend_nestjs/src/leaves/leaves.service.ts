import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, ServiceUnavailableException, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { EMPLOYEE_MODEL, EmployeeDocument } from "../schemas/employee.schema";
import { LEAVE_MODEL, LeaveDocument } from "../schemas/leaves.schema";
import { AddLeaveDTO } from "./dtos/add-leave.dto";
import { UpadteLeaveStatusDTO } from "./dtos/update-leave-status.dto";

@Injectable()
export class LeaveService {
    constructor(
        @InjectModel(LEAVE_MODEL) private leaveModel: Model<LeaveDocument>,
        @InjectModel(EMPLOYEE_MODEL) private employeeModel: Model<EmployeeDocument>
    ) { }

    /**
     * Adds a new leave for an employee after checking leave balance and updating employee's leave records.
     * @param empId The employee's ID.
     * @param leaveData The DTO containing the details of the leave to be added.
     * @returns A message confirming the leave was added and the updated leave balance.
     * @throws NotFoundException if the employee is not found.
     * @throws BadRequestException if the employee has insufficient leave balance.
     */
    async addLeaves(empId: string, leaveData: AddLeaveDTO) {
        try {
            const employee = await this.employeeModel.findById(empId);

            if (!employee) {
                throw new NotFoundException('Employee not found');
            }

            let totalLeavesRequested = 0;

            if (leaveData.duration === 'Full_Day') {
                // Each leave counts as 1 day
                totalLeavesRequested = leaveData.leaves;
            } else if (leaveData.duration === 'Half_Day') {
                // Half-day leave counts as 0.5 day
                totalLeavesRequested = leaveData.leaves * 0.5;
            } else {
                totalLeavesRequested = leaveData.leaves;
            }

            if (employee.balanced_leaves < totalLeavesRequested) {
                throw new BadRequestException('Insufficient leave balance');
            }

            leaveData.leaves = totalLeavesRequested;
            const leave = new this.leaveModel({ ...leaveData, emp: empId });
            await leave.save();

            const balancedLeaves = employee.balanced_leaves - totalLeavesRequested;
            // Deduct the leaves from balanced leaves
            await this.employeeModel.findByIdAndUpdate(
                empId,
                { $set: { balanced_leaves: balancedLeaves } },
                { new: true, runValidators: true }
            );

            return {
                message: 'Leave Added Successfully',
                balanced_leaves: balancedLeaves,
                leave: leave
            };

        } catch (error) {
            if (error.name === 'NotFoundException') {
                throw new NotFoundException(error);
            }
            if (error.name === 'UnauthorizedException') {
                throw new UnauthorizedException(error);
            }
            if (error.name === 'BadRequestException') {
                throw new BadRequestException(error);
            }
        }
    }

    /**
     * Retrieves all leave records for employees.
     * @returns A list of all leave records for employees.
     * @throws BadRequestException if there is a validation error.
     */
    async getAllEmployeesLeaves() {
        try {
            return await this.leaveModel.find().sort({ createdAt: -1 });
        } catch (error) {
            throw new InternalServerErrorException('An error while retriving leaves.')
        }
    }

    /**
     * Retrieves all leave records and balance for a specific employee.
     * @param empId The employee's ID.
     * @returns An object containing the employee's leave records and current leave balance.
     * @throws NotFoundException if the employee is not found.
     * @throws BadRequestException if a validation error occurs.
     */
    async getEmployeeLeaves(empId: string) {
        try {
            const empLeaves = await this.leaveModel.find({ emp: empId });
            const employee = await this.employeeModel.findById(empId);

            if (empLeaves.length) {
                return {
                    leaves: empLeaves,
                    balanced_leaves: employee.balanced_leaves
                };
            } else {
                return {
                    leaves: null,
                    balanced_leaves: employee.balanced_leaves
                }
            }
        } catch (error) {
            throw new InternalServerErrorException('An error while retriving leaves of the employee.')
        }
    }

    /**
     * Updates the status of a specific leave request and adjusts the employee's balanced leave if the leave is rejected.
     * @param id The leave record ID.
     * @param updateLeaveStatus The DTO containing updated leave status and other related information.
     * @returns A message confirming the leave status update and the updated leave record.
     * @throws NotFoundException if the leave record is not found.
     * @throws BadRequestException if there is a validation error.
     * @throws ServiceUnavailableException if the update fails due to a service issue.
     */
    async updateLeaveStatus(id: string, updateLeaveStatus: UpadteLeaveStatusDTO) {
        try {

            const { empId, noOfLeaves, leave_status } = updateLeaveStatus;

            const updatedLeave = await this.leaveModel.findByIdAndUpdate(
                id,
                { $set: { leave_status: leave_status } },
                { new: true, runValidators: true, populate: { path: 'emp', select: { name: 1 } } }
            );

            if (leave_status === 'Rejected') {
                const employee = await this.employeeModel.findById(empId);
                const balancedLeaves = employee.balanced_leaves + Number(noOfLeaves);

                // Add the leaves to balanced leaves
                await this.employeeModel.findByIdAndUpdate(
                    empId,
                    { $set: { balanced_leaves: balancedLeaves } },
                    { new: true, runValidators: true }
                );
            }

            if (!updatedLeave) {
                throw new NotFoundException('Leave not found');
            }

            return {
                message: 'Leave status updated successfully.',
                leave: updatedLeave
            };
        } catch (error) {
            if (error.name === 'NotFoundException') {
                throw new NotFoundException(error);
            }
            if (error.name === 'ValidationError') {
                throw new BadRequestException(error);
            }

            throw new ServiceUnavailableException('Update failed, please try again.');
        }
    }

    /**
     * Deletes a specific leave record and updates the employee's leave balance.
     * @param empId The employee's ID.
     * @param id The leave record ID.
     * @param leaves The number of leave days to be restored to the employee's balance.
     * @returns A message confirming the leave deletion and the updated leave balance.
     * @throws NotFoundException if the leave record is not found.
     * @throws BadRequestException if there is a validation error.
     */
    async deleteEmployeeLeave(empId: string, id: string, leaves: number) {
        try {
            const leave = await this.leaveModel.findByIdAndDelete(id);
            const employee = await this.employeeModel.findById(empId);

            const balancedLeaves = employee.balanced_leaves + Number(leaves);

            await this.employeeModel.findByIdAndUpdate(
                empId,
                { $set: { balanced_leaves: balancedLeaves } },
                { new: true, runValidators: true }
            );

            if (!leave) {
                throw new NotFoundException("Leave not found");
            }

            return {
                message: 'Leave Deleted Successfully',
                balanced_leaves: balancedLeaves,
                leaveId: id
            }
        } catch (error) {
            if (error.name === 'NotFoundException') {
                throw new NotFoundException(error);
            }

            throw new InternalServerErrorException('An error while deleting leave.')
        }
    }

    /**
     * Filters leave records based on optional leave type and leave status.
     * @param leaveType Optional filter to select leave records by type.
     * @param leaveStatus Optional filter to select leave records by status.
     * @returns A list of filtered leave records.
     */
    async filterEmployeesLeaves(leaveType?: string, leaveStatus?: string) {
        try {
            const query: any = {};

            if (leaveType) {
                query.leaves_type = leaveType;
            }

            if (leaveStatus) {
                query.leave_status = leaveStatus;
            }

            return this.leaveModel.find(query).exec();
        } catch (error) {
            throw new BadRequestException(error.errors);
        }
    }

    /**
    * Filters leave records for a specific employee by leave type.
    * @param empId The employee's ID.
    * @param leaveType The leave type to filter by.
    * @returns A list of leave records matching the employee and leave type.
    * @throws BadRequestException if an error occurs while filtering.
    */
    async filterOneEmployeeLeaves(empId: string, leaveType: string) {
        try {
            return this.leaveModel.find({ emp: empId, leaves_type: leaveType }).exec();
        } catch (error) {
            throw new InternalServerErrorException('An error while filtering leaves.')
        }
    }
}