import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req } from "@nestjs/common";
import { AuthService } from "../auth/auth.service";
import { ProjectService } from "./project.service";
import { AddProjectDTO } from "./dtos/add-project.dto";
import { UpdateProjectDTO } from "./dtos/update-project.dto";

@Controller("project")
export class ProjectController {

    constructor(
        private projectService: ProjectService,
        private authService: AuthService
    ) { }

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
     * Retrives all projects records.
     * @returns A list of all projects records.
     */
    @Get()
    getAllProjects() {
        return this.projectService.getAllProjects();
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