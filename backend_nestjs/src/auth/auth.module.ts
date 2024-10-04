import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ADMIN_MODEL, AdminSchema } from '../schemas/admin.schema';
import { EMPLOYEE_MODEL, EmployeeSchema } from '../schemas/employee.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ADMIN_MODEL, schema: AdminSchema },
      { name: EMPLOYEE_MODEL, schema: EmployeeSchema },
    ]),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}
