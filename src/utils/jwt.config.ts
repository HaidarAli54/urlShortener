import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {

        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request); 

        if (!token) {
            throw new UnauthorizedException('Token not provided');
        }

        try {

            const payload = await this.jwtService.verifyAsync(token);
            request.user = payload; 
            return true;

        } catch (err) {

            console.error('Token verification error:', err.message);
            throw new UnauthorizedException('Invalid token');

        }

    }
    private extractTokenFromHeader(request: Request): string | null {

        const authorization = request.headers['authorization'];

        if (authorization && authorization.startsWith('Bearer')) {

            return authorization.split(' ')[1]; 

        }

        return null;

    }
}