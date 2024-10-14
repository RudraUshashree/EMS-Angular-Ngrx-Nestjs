import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req } from "@nestjs/common";
import { AuthService } from "../auth/auth.service";
import { DailyUpdateService } from "./daily-update.service";
import { AddDailyUpdateDTO } from "./dtos/add-daily-update.dto";

@Controller("daily-update")
export class DailyUpdateController {

    constructor(
        private dailyUpdateService: DailyUpdateService,
        private authService: AuthService
    ) { }

    /**
     *Add new daily update.
     * @param addDailyUpdateDto The data transfer object containing aaily update details.
     * @returns The successfully added message.
     */
    @Post("add")
    addDailyUpdate(@Body() addDailyUpdateDto: AddDailyUpdateDTO) {
        return this.dailyUpdateService.addDailyUpdate(addDailyUpdateDto);
    }

    /**
     * Retrives all daily update records.
     * @returns A list of all daily update records.
     */
    @Get()
    getAllDailyUpdates() {
        return this.dailyUpdateService.getAllDailyUpdates();
    }

    /**
    * Retrieve all daily update records for a specific employee by their ID.
    * @param empId The employee ID.
    * @returns The list of daily update records for the employee.
    */
    @Get(':empId')
    getEmployeeDailyUpdates(@Param("empId") empId: string) {
        return this.dailyUpdateService.getEmployeeDailyUpdates(empId);
    }

    // /**
    //  * Update the status of a specific leave record.
    //  * @param id The leave record ID.
    //  * @param updateProject The DTO containing the updated leave status.
    //  * @returns The result of the leave status update.
    //  */
    // @Put(":id")
    // updateProject(@Param("id") id: string, @Body() updateProject) {
    //     return this.dailyUpdateService.updateProject(id, updateProject);
    // }
}