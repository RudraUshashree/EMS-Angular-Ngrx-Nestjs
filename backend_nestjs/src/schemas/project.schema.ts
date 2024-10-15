import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { EMPLOYEE_MODEL } from "./employee.schema";
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

@Schema({
    timestamps: true,
})
export class Project {
    @Prop([{ type: MongooseSchema.Types.ObjectId, ref: EMPLOYEE_MODEL }])
    emp: Types.ObjectId;

    @Prop({
        required: true
    })
    title: string;

    @Prop({
        required: true
    })
    description: string;

    @Prop({
        required: true
    })
    technologies: string;

    @Prop({
        required: true
    })
    client_name: string;

    @Prop({
        required: true
    })
    hours: number;

    @Prop({
        required: true
    })
    price: number;

    @Prop({
        required: true,
        default: true
    })
    status: boolean
}

export type ProjectDocument = Project & Document;
export const ProjectSchema = SchemaFactory.createForClass(Project);
export const PROJECT_MODEL = Project.name;

ProjectSchema.pre("find", function (next: Function) {
    this.populate({ path: "emp", select: { _id: 1, name: 1 } })
    next();
})

ProjectSchema.pre("save", function (next: Function) {
    this.populate({ path: "emp", select: { _id: 1, name: 1 } })
    next();
})

ProjectSchema.pre("findOneAndUpdate", function (next: Function) {
    this.populate({ path: "emp", select: { _id: 1, name: 1 } })
    next();
})