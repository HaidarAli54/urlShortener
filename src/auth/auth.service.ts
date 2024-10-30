import { Injectable, UnauthorizedException, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/utils/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwtService: JwtService) {}

    async register(data : { username: string, email: string, password: string }) {

        const userExists = await this.prisma.user.findUnique({ where: { email: data.email }});
        if (userExists) {
            throw new ConflictException('Email already exists');
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);
        const user = await this.prisma.user.create({
            data: {
                username : data.username,
                email: data.email,
                password: hashedPassword
            },
        });

        const { password, ...result } = user;
        return result;
        
    }
    async login(data : { email: string, password: string }) {

        const user = await this.prisma.user.findUnique({ where: { email : data.email } });
        
        if (!user || !user.password) {
            throw new UnauthorizedException('Invalid email or password');
        }

        if (!data.password) {
            throw new UnauthorizedException('Password is required');
        }


        const isPasswordValid = await bcrypt.compare(data.password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid password');
        }

        const token = this.jwtService.sign({ userId: user.id, email: user.email });

        return {
            accessToken: token,
            user: { id: user.id, username: user.username, email: user.email },
        }
    }
}
