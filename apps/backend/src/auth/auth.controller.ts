import { Body, Controller, Post, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @Post('signup')
    async signup(@Body() data: {
        firstName: string;
        lastName: string;
        email: string;
        phone?: string;
        password: string;
    }){
        return this.authService.signup(data)
    }

    @Post('login')
    async login(@Body() loginData: { email: string; password: string }) {
        const user = await this.authService.validateUser(
        loginData.email,
        loginData.password,
        );
        return this.authService.login(user);
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    async logout(@Req() req) {
        return this.authService.logout(req.user.userId);
    }
    
}
