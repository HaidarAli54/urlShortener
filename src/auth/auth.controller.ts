import { Body, Controller, Post, Delete, Param, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateUserDto } from './dto/update.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    async register(@Body() body: RegisterDto) {
        return this.authService.register({
            username: body.username,
            email: body.email,
            password: body.password,
        });
    }

    @Post('login')
    async login(@Body() body:LoginDto ) {
        return this.authService.login({
            email: body.email,
            password: body.password,
        });
    }

    @Put('update/:id')
    async updateUser (@Param('id') id: string, @Body() body: UpdateUserDto) {
        return this.authService.updateUser (id, body);
    }


    @Delete('delete/:id')
    async deleteUser (@Param('id') id: string) {
        return this.authService.deleteUser (id);
    }
}
