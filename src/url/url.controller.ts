import { Controller, Post, Body, UseGuards,Req, HttpStatus, HttpException  } from '@nestjs/common';
import { UrlService } from './url.service';
import { JwtAuthGuard } from '../utils/jwt.config';
import { CreateShortUrlDto } from './dto/createShortUrl.dto';

@UseGuards(JwtAuthGuard)
@Controller('url')
export class UrlController {
    constructor(private readonly urlService: UrlService) {}

    @Post('shorten')
    async createShortUrl(@Body() body: CreateShortUrlDto, @Req() req: any) {

        const userId = req.user.id;

        try {
            // create short URL
            const shortUrl = await this.urlService.createShortUrl(body.originalUrl, body.customUrl, userId);
            return { shortUrl };

        } catch (error) {
            console.error(error);
            throw new HttpException('Failed to create short URL', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
