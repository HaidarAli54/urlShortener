import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request); 

        if (!token) {
            throw new UnauthorizedException('Token not provided');
        }

        const user = this.validateToken(token);
        request.user = user;
        return true;
    }
    private extractTokenFromHeader(request: Request): string | null {

        const authorization = request.headers['authorization'];

        if (authorization && authorization.startsWith('Bearer ')) {

            return authorization.split(' ')[1]; 

        }

        return null;

    }
    private validateToken(token: string): any {
        try {
            return this.jwtService.verify(token, {
                secret: process.env.JWT_SECRET, // Ganti dengan kunci rahasia Anda
            });

        } catch (err) {
            console.error('Token verification error:', err.message);
            throw new UnauthorizedException('Invalid token');
        }
    }
}