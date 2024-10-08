import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateProjectDTO {
    @IsArray()
    @IsOptional()
    emp: []

    @IsString()
    @IsOptional()
    title: string;

    @IsString()
    @IsOptional()
    client_name: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsString()
    @IsOptional()
    technologies: string;

    @IsNumber()
    @IsOptional()
    hours: number;

    @IsNumber()
    @IsOptional()
    price: number;
}