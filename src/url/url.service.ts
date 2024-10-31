import { Injectable, ConflictException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/utils/prisma.service';
import { validateCustomUrl } from 'src/utils/url.validation';
import { generateRandomString } from 'src/utils/string.utils';


@Injectable()
export class UrlService {
    private readonly baseUrl: string;
    constructor(
        private readonly prisma: PrismaService, private readonly jwtService: JwtService
    ) { this.baseUrl = process.env.BASE_URL}

    async createShortUrl(originalUrl: string, customUrl?: string, token?: string) {

        if (!token) {
            throw new UnauthorizedException('Token is required');
        }

        const expiresAt = new Date(Date.now() + Number(process.env.EXPIRED_DATE) * 24 * 60 * 60 * 1000); 

        validateCustomUrl(customUrl);

        let shortUrl = customUrl ? customUrl : generateRandomString(6);

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
        const newUrl = await this.prisma.url.create({
            data: {
                originalUrl,
                shortUrl,
                customUrl,
                expiresAt,
                userId,
            },
        });

        const fullShortUrl = `${this.baseUrl}/${newUrl.shortUrl}`;

        return {
            shortUrl: fullShortUrl,
            expiresAt,
        };
    };


    async findUrlByShortUrl(shortUrl: string) {
        return this.prisma.url.findUnique({
            where: { shortUrl },
        });
    }

}
