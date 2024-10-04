import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Leave_Type } from "../../constants/leaves-type.constants";

export class AddLeaveDTO {
    @IsString()
    @IsNotEmpty()
    start_date: Date;

    @IsString()
    @IsNotEmpty()
    end_date: Date;

    @IsNumber()
    @IsOptional()
    leaves: number;

    @IsString()
    @IsOptional()
    duration: string;

    @IsEnum(Leave_Type)
    @IsNotEmpty()
    leaves_type: Leave_Type;

    @IsString()
    @IsNotEmpty()
    reason: string;
}