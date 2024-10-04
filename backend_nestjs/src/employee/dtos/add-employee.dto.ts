import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Emp_Type } from "../../constants/emp-type.constants";
import { Work_Type } from "../../constants/work_type.constants";

export class AddEmployeeDTO {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    dob: Date;

    @IsString()
    @IsNotEmpty()
    contact: string;

    @IsString()
    @IsNotEmpty()
    address: string;

    @IsString()
    @IsOptional()
    city: string;

    @IsString()
    @IsOptional()
    zipcode: string;

    @IsNumber()
    @IsNotEmpty()
    experience: number;

    @IsString()
    @IsNotEmpty()
    worked_technologies: string;

    @IsNumber()
    @IsNotEmpty()
    salary: number;

    @IsEnum(Emp_Type)
    @IsNotEmpty()
    emp_type: Emp_Type;

    @IsEnum(Work_Type)
    @IsNotEmpty()
    work_type: Work_Type;

    @IsString()
    @IsNotEmpty()
    doj: Date;

    @IsString()
    @IsNotEmpty()
    image: string[];
}