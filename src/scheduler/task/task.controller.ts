import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { CreateTaskDto } from '../dto/create-task.dto';
import { TaskService } from './task.service';

@Controller('scheduler/task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post('create')
  async createTask(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.createTask(createTaskDto);
  }

  @Get('execute/:taskId')
  async executeTask(@Param('taskId') taskId: string) {
    return this.taskService.executeTask(taskId);
  }
  @Get('scheduled')
  getAllScheduledTasks() {
    return this.taskService.getAllScheduledTasks();
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
}
