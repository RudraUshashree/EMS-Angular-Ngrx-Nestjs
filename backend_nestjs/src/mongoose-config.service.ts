import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MongooseModuleOptions, MongooseOptionsFactory } from "@nestjs/mongoose";

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
    constructor(private configService: ConfigService) {}

    createMongooseOptions(): Promise<MongooseModuleOptions> | MongooseModuleOptions {
        const username = this.configService.get<string>("DATABASE_USER");
        const password = this.configService.get<string>("DATABASE_PASSWORD");
        const host = this.configService.get<string>("DATABASE_HOST");
        const dbname = this.configService.get<string>("DATABASE_NAME");

        const uri = `mongodb+srv://${username}:${password}@${host}/${dbname}?retryWrites=true&w=majority`;
               
        return {uri};
    }
}