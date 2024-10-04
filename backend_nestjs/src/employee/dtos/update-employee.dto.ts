import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { Emp_Type } from "../../constants/emp-type.constants";
import { Work_Type } from "../../constants/work_type.constants";

export class UpdateEmployeeDTO {
    @IsString()
    @IsOptional()
    name: string;

    @IsString()
    @IsOptional()
    dob: Date;

    @IsString()
    @IsOptional()
    contact: string;

    @IsString()
    @IsOptional()
    address: string;

    @IsString()
    @IsOptional()
    city: string;

    @IsString()
    @IsOptional()
    zipcode: string;

    @IsNumber()
    @IsOptional()
    experience: number;

    @IsString()
    @IsOptional()
    worked_technologies: string | string[];

    @IsNumber()
    @IsOptional()
    salary: number;

    @IsEnum(Emp_Type)
    @IsOptional()
    emp_type: Emp_Type;

    @IsEnum(Work_Type)
    @IsOptional()
    work_type: Work_Type;

    @IsString()
    @IsOptional()
    doj: Date;
}