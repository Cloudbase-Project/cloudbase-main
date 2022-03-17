import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { User, UserSchema } from 'src/user/entities/user.entity';
import { authController } from './auth.controller';
import { authService } from './auth.service';
import { Password } from './utils/password';
import { JWT } from './utils/token';
import { AuthGuard } from './guards/authGuard';
import { GoogleOAuth } from './utils/GoogleOAuth';
import { MongooseModule } from '@nestjs/mongoose';
import { emailModule } from 'src/email/email.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ConfigModule,
    forwardRef(() => emailModule),
  ],
  controllers: [authController],
  providers: [authService, Password, AuthGuard, GoogleOAuth, JWT],
  exports: [JWT, AuthGuard],
})
export class authModule {}
