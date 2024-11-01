import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UrlService } from './url.service';
import { UrlController } from './url.controller';
import { JwtAuthGuard } from '../utils/jwt.config';
import { AuthService } from '../auth/auth.service';
import { PrismaService } from '../utils/prisma.service';



@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET, 
      signOptions: { expiresIn: '1h' }, 
      }),
    ],
  providers: [UrlService, JwtAuthGuard, AuthService,  PrismaService],
  controllers: [UrlController],
})
export class UrlModule {}
