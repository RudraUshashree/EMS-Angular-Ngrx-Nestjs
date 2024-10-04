import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { EmployeeController } from "./employee.controller";
import { EmployeeService } from "./employee.service";
import { EMPLOYEE_MODEL, EmployeeSchema } from "../schemas/employee.schema";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthMiddleware } from "../middlewares/auth.middleware";

const MODELS = [
  {
    name: EMPLOYEE_MODEL,
    schema: EmployeeSchema
  }
];

@Module({
  imports: [MongooseModule.forFeature(MODELS)],
  controllers: [EmployeeController],
  providers: [EmployeeService],
  exports: [MongooseModule, EmployeeService]
})
export class EmployeeModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'employee', method: RequestMethod.GET },
        { path: 'employee/search', method: RequestMethod.GET },
        { path: 'employee/filter', method: RequestMethod.GET },
        { path: 'employee/:id', method: RequestMethod.GET },
        { path: 'employee/:id', method: RequestMethod.PUT },
      );
  }
}