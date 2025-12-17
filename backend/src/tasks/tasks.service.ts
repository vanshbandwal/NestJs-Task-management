import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument } from './models/task.schema';
import { Model, Types } from 'mongoose';
import { CreateTaskDto } from './Dto/Create-task.dto';


@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  // ✅ Create task with userId
  async create(createTaskDto: CreateTaskDto, userId: Types.ObjectId) {
    const newTask = new this.taskModel({
      ...createTaskDto,
      userId,
    });
    return await newTask.save();

  }
 
  async fetch(userId?: Types.ObjectId) {
    console.log(userId)
    const query = userId ? { userId } : {};
    const tasks = await this.taskModel.find(query).sort({ createdAt: -1 });
    return tasks;
  }
  async deleteTask(id:string){
    const taskId = new Types.ObjectId(id);
    const deleted = await this.taskModel.findByIdAndDelete(taskId);
    return {
      success:true,
      deleted
    };
  }
}
