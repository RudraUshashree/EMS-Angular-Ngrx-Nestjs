import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { Leave_Type } from "../constants/leaves-type.constants";
import { Employee, EMPLOYEE_MODEL } from "./employee.schema";
import { Leave_Status } from "../constants/leave-status.constants";

@Schema({
    timestamps: true,
})
export class Leave {
    @Prop({
        type: Types.ObjectId,
        ref: EMPLOYEE_MODEL
    })
    emp: string | Types.ObjectId | Employee;

    @Prop()
    leaves: number;

    @Prop()
    duration: string;

    @Prop({
        type: String,
        required: true,
        enum: Object.keys(Leave_Type)
    })
    leaves_type: Leave_Type;

    @Prop({
        required: true
    })
    start_date: Date;

    @Prop({
        required: true
    })
    end_date: Date;

    @Prop({
        required: true
    })
    reason: string;

    @Prop({
        default: Leave_Status.Pending
    })
    leave_status: string;
}

export type LeaveDocument = Leave & Document;
export const LeaveSchema = SchemaFactory.createForClass(Leave);
export const LEAVE_MODEL = Leave.name;


LeaveSchema.pre("find", function (next: Function) {
    this.populate({ path: "emp", select: { name: 1 } })
    next();
})