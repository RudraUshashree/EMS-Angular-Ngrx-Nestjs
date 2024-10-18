import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { DailyUpdateService } from "./daily-update.service";
import { AddDailyUpdateDTO } from "./dtos/add-daily-update.dto";
import { UpdateDailyUpdateDTO } from "./dtos/update-daily-update.dto";

@Controller("daily-update")
export class DailyUpdateController {

    constructor(private dailyUpdateService: DailyUpdateService) { }

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

    /**
     * Update the status of a specific daily update record.
     * @param id The daily update record ID.
     * @param updateDailyUpdate The DTO containing the updated daily update record.
     * @returns The result of the updated daily update record.
     */
    @Put(":id")
    updateDailyUpdate(@Param("id") id: string, @Body() updateDailyUpdate: UpdateDailyUpdateDTO) {
        return this.dailyUpdateService.updateDailyUpdate(id, updateDailyUpdate);
    }
}