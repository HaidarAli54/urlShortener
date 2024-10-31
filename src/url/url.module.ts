import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UrlService } from './url.service';
import { UrlController } from './url.controller';
import { JwtAuthGuard } from 'src/utils/jwt.config';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/utils/prisma.service';



@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET, // Gantilah dengan rahasia Anda
      signOptions: { expiresIn: '60s' }, // Atur opsi tanda tangan sesuai kebutuhan Anda
      }),
    ],
  providers: [UrlService, JwtAuthGuard, AuthService,  PrismaService],
  controllers: [UrlController],
})
export class UrlModule {}
