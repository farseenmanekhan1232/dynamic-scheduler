import { Injectable, NotFoundException } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import * as fs from 'fs';
import * as cron from 'node-cron';
import * as path from 'path';
import { CreateTaskDto } from '../dto/create-task.dto';

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
    this.scheduleTask(newTask);
    return newTask;
  }

  async executeTask(taskId: string) {
    try {
      console.log(`Executing task with ID: ${taskId}`);
      this.deleteScheduledTask(taskId);
      return { message: `task with ID: ${taskId} executed successfully` };
    } catch (e) {
      return { message: `task with ID: ${taskId} not found` };
    }
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
    // You may want to reschedule the task here if the scheduleTime is updated
    return db.tasks[taskIndex];
  }

  deleteScheduledTask(taskId: string) {
    const job = this.schedulerRegistry.getCronJob(taskId);
    if (job) {
      job.stop();
      this.schedulerRegistry.deleteCronJob(taskId);
      console.log(`Deleted task with ID: ${taskId}`);
    } else {
      console.log(`Task with ID ${taskId} not found in the scheduler`);
    }
  }

  private scheduleTask(task: {
    taskId: string;
    scheduleTime: Date;
    taskName: string;
  }) {
    const date = new Date(task.scheduleTime);
    const cronExpression = convertDateToCronExpression(date);

    // Use any type for now, as SchedulerRegistry might not be fully compatible with node-cron types
    const job: any = cron.schedule(cronExpression, () => {
      this.executeTask(task.taskId);
    });

    this.schedulerRegistry.addCronJob(task.taskId, job);
    job.start();
  }

  getAllScheduledTasks() {
    const scheduledTasks = this.schedulerRegistry.getCronJobs();
    return Array.from(scheduledTasks.keys()).map((taskId) => ({ taskId }));
  }
  private readJsonFile() {
    if (!fs.existsSync(this.jsonDbPath)) {
      return { tasks: [] };
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

function convertDateToCronExpression(date: Date): string {
  return `${date.getMinutes()} ${date.getHours()} ${date.getDate()} ${
    date.getMonth() + 1
  } *`;
}
