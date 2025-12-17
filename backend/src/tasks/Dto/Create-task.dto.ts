import { IsString, IsOptional, IsIn, IsDateString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsIn(['pending', 'done'])
  status?: string = 'pending';

  @IsOptional()
  @IsIn(['low', 'medium', 'high'])
  priority?: string = 'low';

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsString({ each: true })
  tags?: string[];
}
