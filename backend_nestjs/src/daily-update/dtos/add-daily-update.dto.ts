import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class AddDailyUpdateDTO {
    @IsString()
    @IsOptional()
    emp: string;

    @IsString()
    @IsNotEmpty()
    work: string;

    @IsString()
    @IsOptional()
    project_type: string;

    @IsArray()
    @IsOptional()
    project: [];

    @IsString()
    @IsOptional()
    skill_title: string;

    @IsNumber()
    @IsNotEmpty()
    hours: number;

    @IsString()
    @IsNotEmpty()
    update_content: string;
}