import { Module } from '@nestjs/common';
import { userService } from './user.service';
import { userController } from './user.controller';
import { User, UserSchema, UserDocument } from './entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { AuthGuard } from '../auth/guards/authGuard';
import { authModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Project, ProjectSchema } from './entities/project.entity';
import { Service, ServiceSchema } from './entities/service.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Project.name, schema: ProjectSchema },
      { name: Service.name, schema: ServiceSchema },
    ]),
    HttpModule,
    ConfigModule,
    authModule,
  ],
  controllers: [userController],
  providers: [userService, User],
  exports: [userService, MongooseModule, User],
})
export class userModule {}
