import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/utils/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class UrlService {
    constructor(private prisma: PrismaService, private jwtService: JwtService) {}

    async createShortUrl(originalUrl: string, customUrl?: string, token?: string) {
        if (!token) {
            throw new UnauthorizedException('Token is required');
        }

        const expiresAt = new Date(Date.now() + 5 * 365 * 24 * 60 * 60 * 1000); //5 years

        let shortUrl = customUrl ? customUrl : uuidv4().slice(0, 10);

        let userId;
        try {
            const decodedToken = this.jwtService.verify(token);
            
            userId = decodedToken.id;

        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }

        // Check if the short URL already exists
        const existingUrl = await this.prisma.url.findUnique({ where: { shortUrl } });
        if (existingUrl) {
            throw new ConflictException('Short URL already exists');
        }
      // Create and return the new URL record
        return this.prisma.url.create({
            data: {
                originalUrl,
                shortUrl,
                customUrl,
                expiresAt,
                userId,
            },
        });
    }
}
