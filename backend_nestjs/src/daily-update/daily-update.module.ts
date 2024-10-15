import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { AuthModule } from "../auth/auth.module";
import { DailyUpdateController } from "./daily-update.controller";
import { DailyUpdateService } from "./daily-update.service";
import { DAILY_UPDATE_MODEL, DailyUpdateSchema } from "src/schemas/daily-update.schema";
import { EmployeeModule } from "src/employee/employee.module";
import { ProjectModule } from "src/project/project.module";

const MODELS = [
    {
        name: DAILY_UPDATE_MODEL,
        schema: DailyUpdateSchema
    }
];

@Module({
    imports: [MongooseModule.forFeature(MODELS), AuthModule, ProjectModule, EmployeeModule],
    controllers: [DailyUpdateController],
    providers: [DailyUpdateService],
    exports: [MongooseModule, DailyUpdateService]
})
export class DailyUpdateModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthMiddleware)
            .forRoutes(
                { path: 'daily-update', method: RequestMethod.GET },
                { path: 'daily-update/:id', method: RequestMethod.GET },
                { path: 'daily-update/add', method: RequestMethod.POST },
                { path: 'daily-update/:id', method: RequestMethod.PUT }
            );
    }
}