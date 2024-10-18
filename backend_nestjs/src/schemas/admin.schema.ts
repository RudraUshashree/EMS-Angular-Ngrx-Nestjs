import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as bcrypt from 'bcryptjs';
import { Types } from "mongoose";

@Schema({
    timestamps: true,
})
export class Admin {

    @Prop({
        default: 'Admin'
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

    @Prop()
    token: string;

    isValid: (adminPwd: string) => Promise<Boolean>;
}

export type AdminDocument = Admin & Document;
export const AdminSchema = SchemaFactory.createForClass(Admin);
export const ADMIN_MODEL = Admin.name;

//Middleware
AdminSchema.pre<AdminDocument>("save", async function (next: Function) {
    const hassedPwd = await bcrypt.hash(this.password, +process.env.SALT);
    this.password = hassedPwd;
    next();
})

AdminSchema.method("isValid", async function (adminPwd: string) {
    const hassedPwd = this.password;
    const isMatched = await bcrypt.compare(adminPwd, hassedPwd);
    return isMatched;
})