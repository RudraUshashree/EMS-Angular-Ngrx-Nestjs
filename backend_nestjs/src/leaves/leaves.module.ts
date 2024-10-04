import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { LEAVE_MODEL, LeaveSchema } from "../schemas/leaves.schema";
import { LeaveService } from "./leaves.service";
import { LeaveController } from "./leaves.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { AuthModule } from "../auth/auth.module";
import { EmployeeModule } from "../employee/employee.module";

const MODELS = [
    {
        name: LEAVE_MODEL,
        schema: LeaveSchema
    }
];

@Module({
    imports: [MongooseModule.forFeature(MODELS), AuthModule, EmployeeModule],
    controllers: [LeaveController],
    providers: [LeaveService],
    exports: [MongooseModule, LeaveService]
})
export class LeaveModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
          .apply(AuthMiddleware) // Apply the AuthMiddleware
          .forRoutes(
            { path: 'leaves', method: RequestMethod.GET },
            { path: 'leaves/filter', method: RequestMethod.GET },
            { path: 'leaves/filter/:empId', method: RequestMethod.GET },
            { path: 'leaves/emp-leaves/:empId', method: RequestMethod.GET },
            { path: 'leaves/add-leave', method: RequestMethod.POST },
            { path: 'leaves/:id', method: RequestMethod.PUT },
            { path: 'leaves/:id/:leaves', method: RequestMethod.DELETE },
          );
      }
 }