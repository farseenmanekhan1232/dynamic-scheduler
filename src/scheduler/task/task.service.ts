import { Injectable, NotFoundException } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CreateTaskDto } from '../dto/create-task.dto';
import * as fs from 'fs';
import * as path from 'path';
import { CronJob } from 'node-cron';

function convertDateToCronExpression(date) {
  return `${date.getMinutes()} ${date.getHours()} ${date.getDate()} ${
    date.getMonth() + 1
  } *`;
}

@Injectable()
export class TaskService {
  private readonly jsonDbPath = path.resolve('data.json');
  constructor(private schedulerRegistry: SchedulerRegistry) {}
  async createTask(createTaskDto: CreateTaskDto): Promise<any> {
    const db = this.readJsonFile();
    const newTask = {
      ...createTaskDto,
      taskId: this.generateId(),
    };
    db.tasks.push(newTask);
    this.writeJsonFile(db);
    this.scheduleTask(createTaskDto);
    return newTask;
  }

  private executeTask(taskName: string) {
    console.log(`Executing task: ${taskName}`);
    this.deleteScheduledTask(taskName);
  }

  async getTask(taskId: string): Promise<any> {
    const db = this.readJsonFile();
    const task = db.tasks.find((task) => task.taskId === taskId);
    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }
    return task;
  }

  async updateTask(
    taskId: string,
    updateTaskDto: Partial<CreateTaskDto>,
  ): Promise<any> {
    const db = this.readJsonFile();
    const taskIndex = db.tasks.findIndex((task) => task.taskId === taskId);
    if (taskIndex === -1) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }
    db.tasks[taskIndex] = { ...db.tasks[taskIndex], ...updateTaskDto };
    this.writeJsonFile(db);
    return db.tasks[taskIndex];
  }

  deleteScheduledTask(taskName: string) {
    this.schedulerRegistry.deleteCronJob(taskName);
    console.log(`Deleted task: ${taskName}`);
  }

  // async deleteTask(taskId: string): Promise<void> {
  //   const db = this.readJsonFile();
  //   const taskIndex = db.tasks.findIndex((task) => task.taskId === taskId);
  //   if (taskIndex === -1) {
  //     throw new NotFoundException(`Task with ID ${taskId} not found`);
  //   }
  //   db.tasks.splice(taskIndex, 1);
  //   this.writeJsonFile(db);
  // }

  private scheduleTask(createTaskDto: CreateTaskDto) {
    const date = new Date(createTaskDto.scheduleTime);
    const job = new CronJob(date, () => {
      this.executeTask(createTaskDto.taskName);
    });

    this.schedulerRegistry.addCronJob(createTaskDto.taskName, job);
    job.start();
  }
  private readJsonFile() {
    if (!fs.existsSync(this.jsonDbPath)) {
      return { tasks: [], jobs: [] };
    }
    return JSON.parse(fs.readFileSync(this.jsonDbPath, 'utf8'));
  }

  private writeJsonFile(data: any) {
    fs.writeFileSync(this.jsonDbPath, JSON.stringify(data, null, 2));
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
