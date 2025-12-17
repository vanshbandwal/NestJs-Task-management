import { Body, Controller, Delete, Get, Param, Post, Req, Res } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './Dto/Create-task.dto';
import type { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const token = req.cookies?.jwt;
      console.log(token)
      if (!token) return res.status(401).json({ message: 'Unauthorized' });

      const decoded: any = jwt.verify(token, 'jwt');

      const userId = new Types.ObjectId(decoded.sub);

      const task = await this.tasksService.create(createTaskDto, userId);
      return res.status(201).json(task);
    } catch (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  }

  @Get()
  async fetch(@Req() req: Request, @Res() res: Response) {
    try { 
      const token = req.cookies?.jwt;
      if (!token) return res.status(401).json({ message: 'Unauthorized' });

      const decoded: any = jwt.verify(token, 'jwt');
      const userId = new Types.ObjectId(decoded.sub);
    

      const tasks = await this.tasksService.fetch(userId);
      return res.status(200).json({
        success:true,
        tasks
      });
    } catch (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  }
@Delete(':id')
  async deleteItem(@Param('id') id: string) {
    return await this.tasksService.deleteTask(id);
  }
  
}
