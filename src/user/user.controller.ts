import {
  Body,
  Controller,
  Get,
  Post,
  HttpCode,
  Logger,
  UseGuards,
  Inject,
} from '@nestjs/common';
import { userService } from './user.service';
import { AuthGuard } from 'src/auth/guards/authGuard';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { ApiHeader } from '@nestjs/swagger';

// @ApiHeader({ name: 'Authorization', required: true })
@Controller('user')
export class userController {
  private readonly logger = new Logger('userController');

  constructor(
    private readonly userService: userService,
    @Inject(REQUEST) private readonly req: Request,
  ) {}

  @Get() // route
  @ApiHeader({ name: 'Authorization', required: true })

  // @ApiBasicAuth()
  @UseGuards(AuthGuard)
  @HttpCode(201) // Return type
  getUser() {
    return this.userService.getUser(this.req.id);
  }
}
