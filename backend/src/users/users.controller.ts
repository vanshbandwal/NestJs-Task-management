import { Controller, Post, Body, Get, Param, Res, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import type { Response, Request } from 'express';
import * as jwt from 'jsonwebtoken';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  async signup(
    @Body() body: { name: string; email: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.usersService.signup(
      body.name,
      body.email,
      body.password,
    );

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    return {
      success: true,
      message: 'Signup successful',
    };
  }

  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.usersService.login(body.email, body.password);

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    return { success: true, message: 'Login successful' };
  }

  @Get('profile')
  async profile(@Req() req: Request, @Res() res: Response) {
    try {
      const token = (req as any).cookies?.jwt;
      if (!token) return res.status(401).json({ message: 'Unauthorized' });

      const decoded = jwt.verify(token, 'jwt') as any;
      const user = await this.usersService.findById(decoded.sub);
      return res.json({
        user,
        success: true,
      });
    } catch (err) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }
  }

  @Get(':id')
  async getUser(@Param('id') id: string) {
    return this.usersService.findById(id);
  }
   @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });

    return {
      success: true,
      message: 'Logged out successfully',
    };
  }
}
