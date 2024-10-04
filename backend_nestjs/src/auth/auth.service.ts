import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as jwt from 'jsonwebtoken';
import { ADMIN_MODEL, AdminDocument } from 'src/schemas/admin.schema';
import { EMPLOYEE_MODEL, EmployeeDocument } from 'src/schemas/employee.schema';
import { Request, Response } from 'express';
import { Emp_Status } from '../constants/emp-status.constants';

@Injectable()
export class AuthService {
    /**
     * Constructor for AuthService.
     * @param adminModel The model for interacting with the Admin collection.
     * @param employeeModel The model for interacting with the Employee collection.
     */
    constructor(
        @InjectModel(ADMIN_MODEL) private adminModel: Model<AdminDocument>,
        @InjectModel(EMPLOYEE_MODEL) private employeeModel: Model<EmployeeDocument>,
    ) { }

    /**
     * Generate a JWT token for a user based on their email and id.
     * @param email The email of the user.
     * @param id The id of the user.
     * @returns The generated JWT token.
     */
    generateToken(email: string, id: string) {
        return jwt.sign({ email: email, userId: id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPRIE_TIME })
    }

    /**
     * Extracts and decodes the JWT token from the request headers.
     * @param req The request object containing the authorization header.
     * @param res The response object (not used in this method).
     * @returns The decoded userId from the JWT token.
     */
    getId(req: Request, res: Response) {
        const token = req.headers.authorization.split(" ")[1];
        const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET) as jwt.JwtPayload;
        return decode.userId;
    };

    /**
     * Validates the user by checking their email and password.
     * It searches in the Admin and Employee collections, and checks if the employee is active.
     * @param email The email of the user to validate.
     * @param password The password of the user to validate.
     * @returns The user object if valid, along with their role.
     * @throws UnauthorizedException If the user is not active or if the password is incorrect.
     * @throws NotFoundException If the email does not exist in either Admin or Employee collection.
     */
    async validateUser(email: string, password: string) {
        let role: string;
        let user: any = null;

        // Check in Admin collection
        let admin = await this.adminModel.findOne({ email: email });

        if (admin) {
            role = 'admin';
            user = admin;
        }

        if (!user) {
            let employee = await this.employeeModel.findOne({ email: email });

            if (employee) {
                if (employee.status === Emp_Status.Active) {
                    role = 'employee';
                    user = employee;
                } else {
                    throw new UnauthorizedException('You are not an active employee. Please contact with admin.');
                }
            } else {
                throw new NotFoundException('Invalid Email');
            }
        }

        // If user is found and password matches
        if (user && (await user.isValid(password))) {
            const { password, ...result } = user.toObject();
            return { ...result, role };
        } else {
            throw new UnauthorizedException('Invalid Password');
        }
    }

    /**
     * Handles the login process by validating the user's credentials and generating a JWT token.
     * @param email The email of the user attempting to log in.
     * @param password The password of the user attempting to log in.
     * @returns A message, the user data, and the generated JWT token.
     * @throws UnauthorizedException If the login credentials are invalid.
     */
    async login(email: string, password: string) {
        const user = await this.validateUser(email, password);

        // Generate a token if the password matches
        let token = this.generateToken(user.email, user._id);

        if (token) {
            const tokenObj = { token };

            // Update the user's document with the generated token
            if (user.role === 'admin') {
                await this.adminModel.findByIdAndUpdate(user._id, { $set: tokenObj });
            } else {
                await this.employeeModel.findByIdAndUpdate(user._id, { $set: tokenObj });
            }

            // Return a success message, user and the token
            return {
                message: 'Login Successfully',
                user: user,
                token: token
            };
        }
    }
}
