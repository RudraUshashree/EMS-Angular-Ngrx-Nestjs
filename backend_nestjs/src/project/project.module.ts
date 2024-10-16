import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { AuthModule } from "../auth/auth.module";
import { EmployeeModule } from "../employee/employee.module";
import { ProjectController } from "./project.controller";
import { ProjectService } from "./project.service";
import { PROJECT_MODEL, ProjectSchema } from "src/schemas/project.schema";

const MODELS = [
    {
        name: PROJECT_MODEL,
        schema: ProjectSchema
    }
];

@Module({
    imports: [MongooseModule.forFeature(MODELS), AuthModule, EmployeeModule],
    controllers: [ProjectController],
    providers: [ProjectService],
    exports: [MongooseModule, ProjectService]
})
export class ProjectModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthMiddleware)
            .forRoutes(
                { path: 'project', method: RequestMethod.GET },
                { path: 'project/search', method: RequestMethod.GET },
                { path: 'project/filter', method: RequestMethod.GET },
                { path: 'project/:id', method: RequestMethod.GET },
                { path: 'project/add-project', method: RequestMethod.POST },
                { path: 'project/:id', method: RequestMethod.PUT }
            );
    }
}