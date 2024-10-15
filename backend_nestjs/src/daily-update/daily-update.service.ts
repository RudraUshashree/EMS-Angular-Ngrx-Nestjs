import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { DAILY_UPDATE_MODEL, DailyUpdateDocument } from "src/schemas/daily-update.schema";
import { AddDailyUpdateDTO } from "./dtos/add-daily-update.dto";
import { UpdateDailyUpdateDTO } from "./dtos/update-daily-update.dto";

@Injectable()
export class DailyUpdateService {
    constructor(
        @InjectModel(DAILY_UPDATE_MODEL) private dailyUpdateModel: Model<DailyUpdateDocument>,
    ) { }

    /**
     * Adds a new daily update.
     * @param addDailyUpdateDto The DTO containing the details of the daily update to be added.
     * @returns A message confirming the daily update was added.
     * @throws BadRequestException if the any error occur.
     */
    async addDailyUpdate(addDailyUpdateDto: AddDailyUpdateDTO) {
        try {
            const dailyUpdate = new this.dailyUpdateModel(addDailyUpdateDto);
            const savedDailyUpdate = await dailyUpdate.save();

            await savedDailyUpdate.populate({
                path: "project",
                select: { _id: 1, title: 1, emp: 1 },
                populate: {
                    path: 'emp',
                    select: { _id: 1, name: 1 }
                }
            })

            return {
                message: 'Daily Update Added Successfully.',
                dailyUpdate: savedDailyUpdate
            }
        } catch (error) {
            throw new BadRequestException(error.errors);
        }
    }

    /**
     * Retrieves all daily update records.
     * @returns A list of all daily update records.
     * @throws InternalServerErrorException if there is a validation error.
     */
    async getAllDailyUpdates() {
        try {
            const dailyUpdates = await this.dailyUpdateModel.find().populate({
                path: "project",
                select: { _id: 1, title: 1, emp: 1 },
                populate: {
                    path: 'emp',
                    select: { _id: 1, name: 1 }
                }
            }).sort({ createdAt: -1 });

            return dailyUpdates;
        } catch (error) {
            throw new InternalServerErrorException('An error while retriving daily updates.')
        }
    }

    /**
     * Retrieves all daily update records for a specific employee.
     * @param empId The employee's ID.
     * @returns An object containing the employee's daily update records.
     * @throws InternalServerErrorException if a error occurs.
     */
    async getEmployeeDailyUpdates(empId: string) {
        try {
            const empDailyUpdates = await this.dailyUpdateModel.find({ emp: empId }).populate({
                path: "project",
                select: { _id: 1, title: 1, emp: 1 },
                populate: {
                    path: 'emp',
                    select: { _id: 1, name: 1 }
                }
            }).sort({ createdAt: -1 });

            return empDailyUpdates;
        } catch (error) {
            throw new BadRequestException(error.errors);
        }
    }

    /**
     * Updates an daily update's information based on their ID.
     * @param id The ID of the daily update to be updated.
     * @param updateDailyUpdate The data transfer object containing the updated daily update details.
     * @returns The updated daily update record with the successfull message.
     * @throws NotFoundException If the daily update is not found.
     * @throws BadRequestException If validation fails.
     */
    async updateDailyUpdate(id: string, updateDailyUpdate: UpdateDailyUpdateDTO) {
        try {
            const dailyUpdate = await this.dailyUpdateModel.findByIdAndUpdate(
                id,
                { $set: updateDailyUpdate },
                { new: true, runValidators: true }
            ).lean();

            if (!dailyUpdate) {
                throw new NotFoundException('Daily Update not found');
            }

            return {
                message: 'Updated successfully.',
                dailyUpdate: dailyUpdate
            };
        } catch (error) {
            console.log('error: ', error);
            if (error instanceof NotFoundException) {
                throw new NotFoundException(error.message);
            }

            throw new BadRequestException(error.errors);
        }
    }
}