import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class AddProjectDTO {
    @IsArray()
    @IsOptional()
    emp: []

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    client_name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsNotEmpty()
    technologies: string;

    @IsNumber()
    @IsNotEmpty()
    hours: number;

    @IsNumber()
    @IsNotEmpty()
    price: number;
}