import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb+srv://vanshbandwal93:root@cluster0.qpnbkyv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'),UsersModule, TasksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}


