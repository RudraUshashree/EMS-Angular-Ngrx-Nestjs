import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Emp_Status } from "../constants/emp-status.constants";
import { Emp_Type } from "../constants/emp-type.constants";
import { Types } from "mongoose";
import * as bcrypt from 'bcryptjs';
import { Work_Type } from "../constants/work_type.constants";

@Schema({
    timestamps: true,
})
export class Employee {

    @Prop({
        default: 'Employee'
    })
    role: string;

    @Prop({
        required: true
    })
    name: string;

    @Prop({
        required: true
    })
    email: string;

    @Prop({
        required: true
    })
    password: string;

    @Prop({
        required: true
    })
    dob: Date;

    @Prop({
        default: 20
    })
    assigned_leaves: number;

    @Prop({
        default: 20
    })
    balanced_leaves: number;

    @Prop({
        required: true
    })
    contact: string;

    @Prop({
        required: true
    })
    address: string;

    @Prop()
    city: string;

    @Prop()
    zipcode: string;

    @Prop({
        required: true
    })
    experience: number;

    @Prop({
        required: true
    })
    worked_technologies: string;

    @Prop({
        required: true
    })
    salary: number;

    @Prop({
        type: String,
        required: true,
        enum: Object.keys(Emp_Type)
    })
    emp_type: Emp_Type

    @Prop({
        type: String,
        required: true,
        enum: Object.keys(Work_Type)
    })
    work_type: Work_Type

    @Prop({
        required: true
    })
    doj: Date

    @Prop({
        type: String,
        required: true,
        enum: Object.keys(Emp_Status),
        default: Emp_Status.Active
    })
    status: Emp_Status

    @Prop({
        type: String,
        required: true
    })
    image: string

    @Prop({
        select: false
    })
    token: string;

    isValid: (userPwd: string) => Promise<Boolean>;
}

export type EmployeeDocument = Employee & Document;
export const EMPLOYEE_MODEL = Employee.name;
export const EmployeeSchema = SchemaFactory.createForClass(Employee);

//Middlewares
EmployeeSchema.pre<EmployeeDocument>("save", async function (next: Function) {
    const hassedPwd = await bcrypt.hash(this.password, +process.env.SALT);
    this.password = hassedPwd;
    next();
})

EmployeeSchema.method("isValid", async function (userPwd: string) {
    const hassedPwd = this.password;
    const isMatched = await bcrypt.compare(userPwd, hassedPwd);
    return isMatched;
})

// EmployeeSchema.pre("find", function (next: Function) {
//     // this.populate({ path: "emp", select: { token: -1 } })
//     this.select("token")
//     next();
// })