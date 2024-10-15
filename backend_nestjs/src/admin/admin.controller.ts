import { Body, Controller, Post } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { AddAdminDTO } from "./dtos/add-admin.dto";

@Controller("admin")
export class AdminController {

    /**
     * Constructor for AdminController.
     * @param adminService The service that handles the business logic for admins.
     */
    constructor(private adminService: AdminService) { }

    /**
    * This method calls the service to add an admin using the AddAdminDTO.
    * @param addAdminDto The DTO that contains the details of the admin to be added.
    * @returns The result of the admin creation operation.
    */
    @Post("add-admin")
    addAdmin(@Body() addAdminDto: AddAdminDTO) {
        return this.adminService.addAdmin(addAdminDto);
    }
}