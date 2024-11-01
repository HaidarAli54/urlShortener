import { Controller, Post, Body, UseGuards, Req, HttpStatus, HttpException, Get, Param, Res, NotFoundException, Delete } from '@nestjs/common';
import { UrlService } from './url.service';
import { JwtAuthGuard } from '../utils/jwt.config';
import { CreateShortUrlDto } from './dto/createShortUrl.dto';
import { Response } from 'express';

@Controller('url')
export class UrlController {
    constructor(private readonly urlService: UrlService) {}

    @UseGuards(JwtAuthGuard)
    @Post('shorten')
    async createShortUrl(@Body() body: CreateShortUrlDto, @Req() req: any) {

        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            throw new HttpException('Token not provided', HttpStatus.UNAUTHORIZED);
        }

        try {
            // create short URL
            const shortUrl = await this.urlService.createShortUrl(body.originalUrl, body.customUrl, token);
            
            return { shortUrl };

        } catch (error) {
            console.error(error);
            throw new HttpException(`Failed to create short URL : ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get(':shortUrl')
    async redirect(@Param('shortUrl') shortUrl: string, @Res() res: Response) {
        console.log('Attempting to redirect for short URL:', shortUrl);

        const urlRecord = await this.urlService.findUrlByShortUrl(shortUrl);
        if (!urlRecord) {
            console.error('Short URL not found in database');
            return res.status(HttpStatus.NOT_FOUND).send({ message: 'Short URL not found' });
        }
        console.log('Redirecting to original URL:', urlRecord.originalUrl);

        return res.redirect(urlRecord.originalUrl);
    }

    @UseGuards(JwtAuthGuard)

    @Delete(':shortUrl')

    async deleteShortUrl(@Param('shortUrl') shortUrl: string, @Req() req: any) {

        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {

            throw new HttpException('Token not provided', HttpStatus.UNAUTHORIZED);

        }


        try {
            // Delete short URL
            const response = await this.urlService.deleteShortUrl(shortUrl, token);
            return response;

        } catch (error) {
            console.error(error);
            throw new HttpException(`Failed to delete short URL: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }
}
