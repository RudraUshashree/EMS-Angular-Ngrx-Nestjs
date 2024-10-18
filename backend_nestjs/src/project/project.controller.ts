import { Body, Controller, Get, Param, Post, Put, Query } from "@nestjs/common";
import { ProjectService } from "./project.service";
import { AddProjectDTO } from "./dtos/add-project.dto";
import { UpdateProjectDTO } from "./dtos/update-project.dto";

@Controller("project")
export class ProjectController {

    constructor(private projectService: ProjectService) { }

    /**
     *Add new project.
     * @param addProjectDto The data transfer object containing project details.
     * @returns The successfully added message.
     */
    @Post("add-project")
    addLeaves(@Body() addProjectDto: AddProjectDTO) {
        return this.projectService.addProject(addProjectDto);
    }

    /**
     * Searches for projects based on a search term.
     * @param searchTerm The term used to search projects (by title and client name.).
     * @returns A list of projects that match the search term.
     */
    @Get("search")
    searchProject(@Query("searchTerm") searchTerm: string) {
        return this.projectService.searchProject(searchTerm)
    }

    /**
     * Filters projects by hours, price and status.
     * @param hours Optional query parameter to filter by project hours.
     * @param price Optional query parameter to filter by project price.
     * @param status Optional query parameter to filter by project status.
     * @returns A list of projects matching the filter criteria.
     */
    @Get('filter')
    async filterProjects(
        @Query('hours') hours?: number,
        @Query('price') price?: number,
        @Query('status') status?: string,
    ) {
        return this.projectService.filterProjects(hours, price, status);
    }

    /**
     * Retrives all projects records.
     * @returns A list of all projects records.
     */
    @Get()
    getAllProjects() {
        return this.projectService.getAllProjects();
    }

    /**
     * Retrieve all projects records for a specific employee by their ID.
     * @param empId The employee ID.
     * @returns The list of projects records for the employee.
     */
    @Get(':empId')
    getEmployeeDailyUpdates(@Param("empId") empId: string) {
        return this.projectService.getEmployeeAssignedProjects(empId);
    }

    /**
     * Update the status of a specific leave record.
     * @param id The leave record ID.
     * @param updateProject The DTO containing the updated leave status.
     * @returns The result of the leave status update.
     */
    @Put(":id")
    updateProject(@Param("id") id: string, @Body() updateProject: UpdateProjectDTO) {
        return this.projectService.updateProject(id, updateProject);
    }
}