import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

class registerDto {
    username: string;
    email: string;
    password: string;
}

class loginDto {
    email: string;
    password: string;
}

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    async register(@Body() body: registerDto) {
        return this.authService.register({
            username: body.username,
            email: body.email,
            password: body.password,
        });
    }

    @Post('login')
    async login(@Body() body:loginDto ) {
        return this.authService.login({
            email: body.email,
            password: body.password,
        });
    }
}
