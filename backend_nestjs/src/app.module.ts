import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfigService } from './mongoose-config.service';
import { AdminModule } from './admin/admin.module';
import { EmployeeModule } from './employee/employee.module';
import { LeaveModule } from './leaves/leaves.module';
import { AuthModule } from './auth/auth.module';
import { ProjectModule } from './project/project.module';
import { DailyUpdateModule } from './daily-update/daily-update.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    MongooseModule.forRootAsync({
      useClass: MongooseConfigService
    }),

    AuthModule,
    AdminModule,
    EmployeeModule,
    LeaveModule,
    ProjectModule,
    DailyUpdateModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
