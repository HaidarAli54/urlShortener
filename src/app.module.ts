import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UrlModule } from './url/url.module';
import { JwtAuthGuard } from './utils/jwt.config';
import { JwtModule } from '@nestjs/jwt';

@Module({

  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    AuthModule, 
    UrlModule
  ],
  providers: [JwtAuthGuard],
})
export class AppModule {}
