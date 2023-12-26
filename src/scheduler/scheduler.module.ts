import { Module } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { TaskController } from './task/task.controller';
import { TaskModule } from './task/task.module';
import { TaskService } from './task/task.service';

@Module({
  providers: [TaskService, SchedulerRegistry],
  imports: [TaskModule],
  controllers: [TaskController],
})
export class SchedulerModule {}
