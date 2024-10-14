import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { PROJECT_MODEL, ProjectDocument } from "src/schemas/project.schema";
import { AddProjectDTO } from "./dtos/add-project.dto";
import { UpdateProjectDTO } from "./dtos/update-project.dto";

@Injectable()
export class ProjectService {
    constructor(
        @InjectModel(PROJECT_MODEL) private projectModel: Model<ProjectDocument>,
    ) { }

    /**
     * Adds a new project.
     * @param addProjectDto The DTO containing the details of the project to be added.
     * @returns A message confirming the project was added.
     * @throws BadRequestException if the any error occur.
     */
    async addProject(addProjectDto: AddProjectDTO) {
        try {
            const project = new this.projectModel(addProjectDto);
            await project.save();

            return {
                message: 'Project Added Successfully.',
                project: project
            }
        } catch (error) {
            throw new BadRequestException(error.errors);
        }
    }

    /**
     * Retrieves all project records.
     * @returns A list of all project records.
     * @throws InternalServerErrorException if there is a validation error.
     */
    async getAllProjects() {
        try {
            const projects = await this.projectModel.find();
            return projects;
        } catch (error) {
            throw new InternalServerErrorException('An error while retriving projects.')
        }
    }

    /**
     * Retrieves all projects records for a specific employee.
     * @param empId The employee's ID.
     * @returns An object containing the employee's projects records.
     * @throws InternalServerErrorException if a error occurs.
     */
    async getEmployeeAssignedProjects(empId: string) {
        try {
            const empAssignedProjects = await this.projectModel.find({ emp: empId });
            return empAssignedProjects;
        } catch (error) {
            throw new BadRequestException(error.errors);
        }
    }

    /**
     * Updates an project's information based on their ID.
     * @param id The ID of the project to be updated.
     * @param updateProjectDTO The data transfer object containing the updated project details.
     * @returns The updated project record with the successfull message.
     * @throws NotFoundException If the project is not found.
     * @throws BadRequestException If validation fails.
     */
    async updateProject(id: string, updateProjectDTO: UpdateProjectDTO) {
        try {
            const updatedProject = await this.projectModel.findByIdAndUpdate(
                id,
                { $set: updateProjectDTO },
                { new: true, runValidators: true }
            ).lean();

            if (!updatedProject) {
                throw new NotFoundException('Project not found');
            }

            return {
                message: 'Project updated successfully.',
                project: updatedProject
            };
        } catch (error) {
            console.log('error: ', error);

            if (error instanceof NotFoundException) {
                throw new NotFoundException(error.message);
            }

            throw new BadRequestException(error.errors);
        }
    }
}