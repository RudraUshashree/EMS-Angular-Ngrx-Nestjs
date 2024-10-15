import { IsArray, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateDailyUpdateDTO {
    @IsString()
    @IsOptional()
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
    @IsOptional()
    hours: number;

    @IsString()
    @IsOptional()
    update_content: string;
}