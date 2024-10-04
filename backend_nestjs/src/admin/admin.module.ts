import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AdminController } from "./admin.controller";
import { ADMIN_MODEL, AdminSchema } from "../schemas/admin.schema";
import { AdminService } from "./admin.service";

const MODELS = [
  {
    name: ADMIN_MODEL,
    schema: AdminSchema
  }
];

@Module({
  imports: [MongooseModule.forFeature(MODELS)],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [MongooseModule, AdminService]
})
export class AdminModule { }