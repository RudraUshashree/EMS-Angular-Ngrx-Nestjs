import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types, Schema as MongooseSchema } from 'mongoose';
import { PROJECT_MODEL } from "./project.schema";
import { DAILY_UPDATE_WORK } from "src/constants/daily-update-work.constants";
import { EMPLOYEE_MODEL } from "./employee.schema";

@Schema({
    timestamps: true,
})
export class DailyUpdate {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: EMPLOYEE_MODEL })
    emp: Types.ObjectId;

    @Prop({
        type: String,
        enum: Object.keys(DAILY_UPDATE_WORK)
    })
    work: DAILY_UPDATE_WORK;

    @Prop({
        type: String,
    })
    project_type: string

    @Prop()
    skill_title: string

    @Prop([{ type: MongooseSchema.Types.ObjectId, ref: PROJECT_MODEL }])
    project: Types.ObjectId;

    @Prop({
        required: true
    })
    hours: number;

    @Prop({
        required: true
    })
    update_content: string;
}

export type DailyUpdateDocument = DailyUpdate & Document;
export const DailyUpdateSchema = SchemaFactory.createForClass(DailyUpdate);
export const DAILY_UPDATE_MODEL = DailyUpdate.name;

DailyUpdateSchema.pre("save", function (next: Function) {
    this.populate({ path: "emp", select: { _id: 1, name: 1 } })
    next();
})

DailyUpdateSchema.pre("find", function (next: Function) {
    this.populate({ path: "emp", select: { _id: 1, name: 1 } })
    next();
})

DailyUpdateSchema.pre("findOneAndUpdate", function (next: Function) {
    this.populate({
        path: "project",
        select: { _id: 1, title: 1, emp: 1 },
        populate: {
            path: 'emp',
            select: { _id: 1, name: 1 }
        }
    });
    next();
});