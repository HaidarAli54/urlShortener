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

        const payload = { id: user.id, username: user.username, email: user.email };
        const token = this.jwtService.sign( payload, {
            secret: process.env.JWT_SECRET,
        
            expiresIn: '1h',
        
        });

        return {
            accessToken: token,
            user: { id: user.id, username: user.username, email: user.email },
        }
    }

    async validateToken(token: string): Promise<any> {

        try {
            const decoded = this.jwtService.verify(token, {
                secret: process.env.JWT_SECRET_KEY, // Ganti dengan kunci rahasia Anda
            });
            return decoded; // Mengembalikan data pengguna yang terdekode
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw new UnauthorizedException('Token expired');
            } 
            
            throw new UnauthorizedException('Invalid token');
        }
    }
    async updateUser (id: string, data: { username?: string; email?: string; password?: string }) {
        const userId = parseInt(id, 10)
        const user = await this.prisma.user.findUnique({ where: { id:userId } });

        if (!user) {
            throw new NotFoundException('User  not found');
        }

        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }
        const updatedUser  = await this.prisma.user.update({
            where: { id: userId },
            data,
        });


        const { password, ...result } = updatedUser ; // Menghapus password dari hasil

        return result;

    }


    async deleteUser (id: string) {
        const userId = parseInt(id, 10)
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {

            throw new NotFoundException('User  not found');
        }

        await this.prisma.user.delete({ where: { id : userId } });
        return { message: 'User  deleted successfully' };
    }
}
