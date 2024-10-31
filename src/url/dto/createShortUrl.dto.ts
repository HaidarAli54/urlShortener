import { IsString, IsOptional } from 'class-validator';

export class CreateShortUrlDto {
    @IsString()
    originalUrl: string;

    @IsOptional()
    @IsString()
    customUrl?: string;
}