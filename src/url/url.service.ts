import { Injectable, ConflictException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../utils/prisma.service';
import { validateCustomUrl } from '../utils/url.validation';
import { generateRandomString } from '../utils/string.utils';


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

        const existingUrl = await this.prisma.url.findUnique({ where: { shortUrl } });
        if (existingUrl) {
            throw new ConflictException('Short URL already exists');
        }
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
        try {

            const urlRecord = await this.prisma.url.findUnique({
                where: { shortUrl: shortUrl },
    
            });
    
            console.log('URL Record found:', urlRecord);
    
            return urlRecord;
    
        } catch (error) {
    
            console.error('Error finding URL by shortUrl:', error);
            throw new Error('Could not find URL');
        }

    }

    async deleteShortUrl(shortUrl: string, token: string) {

        if (!token) {
            throw new UnauthorizedException('Token is required');
        }
    
    
        let userId;
        try {
            const decodedToken = this.jwtService.verify(token);
            userId = decodedToken.id;
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }
    
        
        const urlRecord = await this.prisma.url.findUnique({
            where: { shortUrl },
        });
    
        
        if (!urlRecord) {
            throw new NotFoundException('Short URL not found');
        }
    
        if (urlRecord.userId !== userId) {
            throw new UnauthorizedException('You do not have permission to delete this URL');
        }
    
    
        await this.prisma.url.delete({
            where: { shortUrl },
        });
    
    
        return { message: 'Short URL deleted successfully' };
    }

}
