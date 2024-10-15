import { BadRequestException, ConflictException, Injectable, ServiceUnavailableException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ADMIN_MODEL, AdminDocument } from "src/schemas/admin.schema";
import { AddAdminDTO } from "./dtos/add-admin.dto";

@Injectable()
export class AdminService {
    /**
     * Constructor for AdminService.
     * @param adminModel The MongoDB model to interact with the admin collection in the database.
     */
    constructor(
        @InjectModel(ADMIN_MODEL) private adminModel: Model<AdminDocument>,
    ) { }

    /**
     * This method creates a new admin in the database using the provided DTO.
     * @param addAdminDto The DTO containing the details of the admin to be added.
     * @returns A message indicating the result of the admin creation operation.
     * @throws BadRequestException if there is a validation error.
     * @throws ServiceUnavailableException if the admin could not be created due to server issues.
     */
    async addAdmin(addAdminDto: AddAdminDTO) {       
        try {
            const isAdminExists = await this.adminModel.findOne({ email: addAdminDto.email });
			if (isAdminExists) {
                throw new ConflictException('An admin with this email already exists.');
			}

            const user = await this.adminModel.create(addAdminDto);
            if (user) {
                return {
					message: 'Registered Successfully.'
				};
            }

        } catch (error) {
            if (error.name === 'ValidationError') {
                throw new BadRequestException(error.errors);
            }

            if (error.status === 409) {
                throw new ConflictException('An admin with this email already exists.');
            }

            throw new ServiceUnavailableException();
        }
    }
}