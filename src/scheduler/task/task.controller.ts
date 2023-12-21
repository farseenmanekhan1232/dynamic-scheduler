import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from '../dto/create-task.dto';

@Controller('scheduler/task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post('create')
  async createTask(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.createTask(createTaskDto);
  }
  @Get(':taskId')
  async getTask(@Param('taskId') taskId: string) {
    return this.taskService.getTask(taskId);
  }

  @Put(':taskId')
  async updateTask(
    @Param('taskId') taskId: string,
    @Body() updateTaskDto: Partial<CreateTaskDto>,
  ) {
    return this.taskService.updateTask(taskId, updateTaskDto);
  }

  @Delete(':taskId')
  async deleteTask(@Param('taskId') taskId: string) {
    return this.taskService.deleteTask(taskId);
  }
}
