import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req } from "@nestjs/common";
import { LeaveService } from "./leaves.service";
import { Request, Response } from "express";
import { AuthService } from "../auth/auth.service";
import { AddLeaveDTO } from "./dtos/add-leave.dto";
import { UpadteLeaveStatusDTO } from "./dtos/update-leave-status.dto";

@Controller("leaves")
export class LeaveController {

    constructor(
        private leaveService: LeaveService,
        private authService: AuthService
    ) { }

    /**
   *Add new leave for an employee.
   * @param req The request object, used to retrieve the authenticated user's information.
   * @param res The response object.
   * @param addLeavesDto The data transfer object containing leave details.
   * @returns The result of the leave addition process.
   */
    @Post("add-leaves")
    addLeaves(@Req() req: Request, @Req() res: Response, @Body() addLeavesDto: AddLeaveDTO) {
        const empId = this.authService.getId(req, res);
        return this.leaveService.addLeaves(empId, addLeavesDto);
    }

    /**
     * Retrives all employees' leave records.
     * @returns A list of all employees' leave records.
     */
    @Get()
    getAllEmployeesLeaves() {
        return this.leaveService.getAllEmployeesLeaves();
    }

    /**
     * Filter all employees leaves based on leave type and/or leave status.
     * @param leaveType Optional query parameter to filter leaves by type.
     * @param leaveStatus Optional query parameter to filter leaves by status.
     * @returns A list of filtered employee leaves.
     */
    @Get('filter')
    async filterEmployeesLeaves(
        @Query('leaveType') leaveType?: string,
        @Query('leaveStatus') leaveStatus?: string,
    ) {
        return this.leaveService.filterEmployeesLeaves(leaveType, leaveStatus);
    }

    /**
    * Filter leaves for a specific employee based on the employee ID and leave type.
    * 
    * @param empId The employee ID.
    * @param leaveType The type of leave to filter.
    * @returns A list of filtered leave records for the specific employee.
    */
    @Get('filter/:empId')
    async filterOneEmployeeLeaves(
        @Param("empId") empId: string,
        @Query('leaveType') leaveType: string,
    ) {
        return this.leaveService.filterOneEmployeeLeaves(empId, leaveType);
    }

    /**
    * Retrieve all leave records for a specific employee by their ID.
    * @param empId The employee ID.
    * @returns The list of leave records for the employee.
    */
    @Get('emp-leaves/:empId')
    getEmployeeLeaves(@Param("empId") empId: string) {
        return this.leaveService.getEmployeeLeaves(empId);
    }

    /**
     * Update the status of a specific leave record.
     * @param id The leave record ID.
     * @param updateLeaveStatus The DTO containing the updated leave status.
     * @returns The result of the leave status update.
     */
    @Put(":id")
    updateLeaveStatus(@Param("id") id: string, @Body() updateLeaveStatus: UpadteLeaveStatusDTO) {
        return this.leaveService.updateLeaveStatus(id, updateLeaveStatus);
    }

    /**
     * Delete a specific leave record for an employee.
     * @param req The request object, used to retrieve the authenticated user's information.
     * @param res The response object.
     * @param id The leave record ID.
     * @param leaves The number of leave days to delete.
     * @returns The result of the leave deletion process.
     */
    @Delete(":id/:leaves")
    deleteEmployeeLeave(@Req() req: Request, @Req() res: Response, @Param("id") id: string, @Param("leaves") leaves: number) {
        const empId = this.authService.getId(req, res);
        return this.leaveService.deleteEmployeeLeave(empId, id, leaves);
    }
}