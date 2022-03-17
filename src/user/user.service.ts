import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ApplicationException } from 'src/utils/exception/ApplicationException';
import { User, UserDocument } from './entities/user.entity';
import { Model } from 'mongoose';

@Injectable()
export class userService {
  private readonly logger = new Logger('userService');

  constructor(
    @InjectModel('User')
    private readonly userModel: Model<UserDocument>,
  ) {}

  async getUser(userId: string) {
    const user = await this.userModel.findById(userId);
    return user;
  }
}
