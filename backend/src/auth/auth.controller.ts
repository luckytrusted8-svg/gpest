import { Controller, Post, Get, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('demo-users')
  async getDemoUsers() {
    return this.authService.getDemoUsers();
  }

  @Post('login')
  async login(@Body() body: { email: string; password?: string }) {
    return this.authService.login(body.email, body.password || 'password123');
  }
}
