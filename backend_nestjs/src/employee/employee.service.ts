import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException, ServiceUnavailableException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { EMPLOYEE_MODEL, EmployeeDocument } from "../schemas/employee.schema";
import { AddEmployeeDTO } from "./dtos/add-employee.dto";
import { UpdateEmployeeDTO } from "./dtos/update-employee.dto";

@Injectable()
export class EmployeeService {

	/**
	 * Constructor for EmployeeService
	 * @param employeeModel The model for interacting with the Employee collection in MongoDB.
	 */
	constructor(
		@InjectModel(EMPLOYEE_MODEL) private employeeModel: Model<EmployeeDocument>
	) { }

	/**
	* Checks if an employee with the same email already exists, and if not, creates a new record.
	* @param addEmployeeDto The data transfer object containing the employee details.
	* @returns A message indicating the success or failure of the operation.
	* @throws ConflictException If an employee with the provided email already exists.
	* @throws BadRequestException If validation fails.
	* @throws InternalServerErrorException For any unexpected errors.
	*/
	async addEmployee(addEmployeeDto: AddEmployeeDTO) {
		try {
			const isEmployeeExists = await this.employeeModel.findOne({ email: addEmployeeDto.email });
			if (isEmployeeExists) {
				throw new ConflictException('An employee with this email already exists.');
			}

			const filenames = addEmployeeDto.image.join('');

			const addEmployee = {
				...addEmployeeDto,
				image: filenames
			};

			const employee = await this.employeeModel.create(addEmployee);
			if (employee) {
				return {
					message: 'Employee signed up successfully.',
					employeeId: employee._id
				};
			}

		} catch (error) {
			if (error.name === 'ValidationError') {
				throw new BadRequestException('Validation failed: ' + error);
			}

			if (error.status === 409) {
				throw new ConflictException('An employee with this email already exists.');
			}

			throw new InternalServerErrorException('An error occurred while adding the employee.');
		}
	}
	/**
	 * Retrieves all employees.
	 * @returns A list of all employees with their photo URL.
	 * @throws BadRequestException If validation fails.
	 * @throws ServiceUnavailableException If an unexpected error occurs.
	 */
	async getAllEmployees() {
		try {
			const employees = await this.employeeModel.find().lean();

			return employees.map(employee => ({
				...employee,
				photoUrl: `http://localhost:3000/${employee.image}`
			}));

		} catch (error) {
			throw new BadRequestException(error.errors);
		}
	}

	/**
	 * Updates an employee's information based on their ID.
	 * If `worked_technologies` is provided as an array, it is joined into a comma-separated string.
	 * @param id The ID of the employee to be updated.
	 * @param updateEmployeeDto The data transfer object containing the updated employee details.
	 * @returns The updated employee record with the photo URL.
	 * @throws NotFoundException If the employee is not found.
	 * @throws BadRequestException If validation fails.
	 * @throws ServiceUnavailableException If the update fails.
	 */
	async updateEmployee(id: string, updateEmployeeDto: UpdateEmployeeDTO) {
		try {
			let updateQuery = { ...updateEmployeeDto };

			if (Array.isArray(updateQuery.worked_technologies)) {
				const workedTechnologiesUpdate = updateQuery.worked_technologies.join(',');
				updateQuery.worked_technologies = workedTechnologiesUpdate;
			}

			const updatedEmployee = await this.employeeModel.findByIdAndUpdate(
				id,
				{ $set: updateQuery },
				{ new: true, runValidators: true }
			).lean();

			if (!updatedEmployee) {
				throw new NotFoundException('Employee not found');
			}

			const employeeWithPhotoUrl = {
				...updatedEmployee,
				photoUrl: `http://localhost:3000/${updatedEmployee.image}`
			};

			return {
				message: 'Employee updated successfully.',
				employee: employeeWithPhotoUrl
			};
		} catch (error) {
			console.log('error: ', error);

			if (error instanceof NotFoundException) {
				throw new NotFoundException(error.message);
			}
			if (error.name === 'ValidationError') {
				throw new BadRequestException(error.errors);
			}

			throw new ServiceUnavailableException('Update failed, please try again.');
		}
	}

	/**
	 * Retrieves a specific employee's information based on their ID.
	 * @param id The ID of the employee to retrieve.
	 * @returns The employee record with the photo URL.
	 * @throws NotFoundException If the employee is not found.
	 * @throws BadRequestException If validation fails.
	 */
	async getEmployee(id: string) {
		try {
			const employee = await this.employeeModel.findById(id).lean();

			if (!employee) {
				throw new NotFoundException("Employee not found");
			}

			const emp = {
				...employee,
				photoUrl: `http://localhost:3000/${employee.image}`
			}

			return emp;

		} catch (error) {
			if (error.name === 'NotFoundException') {
				throw new NotFoundException(error.errors);
			}
		}
	}

	/**
	 * Searches for employees based on a search term (by name).
	 * @param searchTerm The search term to filter employees by name.
	 * @returns A list of employees matching the search term with their photo URL.
	 * @throws NotFoundException If no employees are found matching the search term.
	 * @throws BadRequestException If validation fails.
	 */
	async searchEmployee(searchTerm: string) {
		try {
			const regex = new RegExp(searchTerm, 'i');
			const searchedEmployee = await this.employeeModel.find({ name: { $regex: regex } }).lean().exec();

			if (searchedEmployee.length === 0) {
				throw new NotFoundException("Employee not found");
			}

			return searchedEmployee.map(employee => ({
				...employee,
				photoUrl: `http://localhost:3000/${employee.image}`
			}));
		} catch (error) {
			if (error.name === 'NotFoundException') {
				throw new NotFoundException(error.errors);
			}

			throw new BadRequestException(error.errors);
		}
	}

	/**
	 * Filters employees by employee type and/or technologies they have worked with.
	 * @param employeeType Optional filter for employee type.
	 * @param workedTechnologies Optional filter for technologies the employee has worked with.
	 * @returns A list of filtered employees with their photo URL.
	 */
	async filterEmployees(employeeType?: string, workedTechnologies?: string) {
		try {
			const query: any = {};

			if (employeeType) {
				query.emp_type = employeeType;
			}

			if (workedTechnologies) {
				const techArray = workedTechnologies.split(',').map(tech => tech.trim());

				if (techArray.length > 0) {
					const regexPattern = techArray.map(tech => `(${tech})`).join('|');
					query.worked_technologies = { $regex: regexPattern, $options: 'i' };
				}
			}

			const filteredEmployees = await this.employeeModel.find(query).lean().exec();

			return filteredEmployees.map(employee => ({
				...employee,
				photoUrl: `http://localhost:3000/${employee.image}`
			}));

		} catch (error) {
			throw new BadRequestException(error.errors);
		}
	}
}