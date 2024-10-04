import { Body, Controller, Get, InternalServerErrorException, Param, Post, Put, Query, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { EmployeeService } from "./employee.service";
import { FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AddEmployeeDTO } from "./dtos/add-employee.dto";
import { UpdateEmployeeDTO } from "./dtos/update-employee.dto";

@Controller("employee")
export class EmployeeController {
    /**
     * Constructor for EmployeeController
     * @param employeeService The service responsible for handling employee operations.
     */
    constructor(private employeeService: EmployeeService) { }

    /**
     * Adds a new employee record, including image files.
     * Uses a file interceptor to handle image uploads and stores them with a unique name.
     * @param files The uploaded image files (limit of 10 files).
     * @param addEmployeeDto The data transfer object (DTO) containing the employee details.
     * @returns A message indicating the success of the operation.
     * @throws InternalServerErrorException If an error occurs while adding the employee.
     */
    @Post("add-employee")
    @UseInterceptors(
        FilesInterceptor('files', 10, {
            storage: diskStorage({
                destination: './uploads',
                filename: (req, file, cb) => {
                    const randomName = Array(32)
                        .fill(null)
                        .map(() => Math.round(Math.random() * 16).toString(16))
                        .join('');
                    return cb(null, `${randomName}${extname(file.originalname)}`);
                },
            }),
        }),
    )
    async addEmployee(@UploadedFiles() files: Express.Multer.File[], @Body() addEmployeeDto: AddEmployeeDTO) {
        try {
            addEmployeeDto.image = files.map(file => file.filename);
            return await this.employeeService.addEmployee(addEmployeeDto);
        } catch (error) {
            throw new InternalServerErrorException('An error occurred while adding the employee.');
        }
    }

    /**
 * Searches for employees based on a search term.
 * @param searchTerm The term used to search employees (by name.).
 * @returns A list of employees that match the search term.
 */
    @Get("search")
    searchEmployee(@Query("searchTerm") searchTerm: string) {
        return this.employeeService.searchEmployee(searchTerm)
    }

    /**
    * Filters employees by employee type and/or worked technologies.
    * @param employeeType Optional query parameter to filter by employee type.
    * @param workedTechnologies Optional query parameter to filter by technologies the employee has worked with.
    * @returns A list of employees matching the filter criteria.
    */
    @Get('filter')
    async filterEmployees(
        @Query('employeeType') employeeType?: string,
        @Query('workedTechnologies') workedTechnologies?: string,
    ) {
        return this.employeeService.filterEmployees(employeeType, workedTechnologies);
    }

    /**
     * Retrieves all employees in the system.
     * @returns A list of all employees.
     */
    @Get()
    getAllEmployees() {
        return this.employeeService.getAllEmployees();
    }

    /**
     * Updates an employee's information based on their unique ID.
     * @param id The ID of the employee to be updated.
     * @param updateEmployeeDto The data transfer object (DTO) containing updated employee details.
     * @returns The updated employee record.
     */
    @Put(":id")
    updateEmployee(@Param("id") id: string, @Body() updateEmployeeDto: UpdateEmployeeDTO) {
        return this.employeeService.updateEmployee(id, updateEmployeeDto);
    }

    /**
    * Retrieves a specific employee's information based on their unique ID.
    * @param id The ID of the employee to retrieve.
    * @returns The employee record corresponding to the given ID.
    */
    @Get(":id")
    getEmployee(@Param("id") id: string) {
        return this.employeeService.getEmployee(id);
    }
}