import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class UpadteLeaveStatusDTO {
    @IsString()
    @IsNotEmpty()
    empId: string;

    @IsNumber()
    @IsNotEmpty()
    noOfLeaves: number;

    @IsString()
    @IsNotEmpty()
    leave_status: string;
}