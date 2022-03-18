import {
  Body,
  Controller,
  Get,
  Post,
  HttpCode,
  Logger,
  UseGuards,
  Inject,
  ValidationPipe,
} from '@nestjs/common';
import { userService } from './user.service';
import { AuthGuard } from 'src/auth/guards/authGuard';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { ApiHeader } from '@nestjs/swagger';
import { createProjectDTO } from './dtos/createProject.dto';
import { ValidationException } from 'src/utils/exception/ValidationException';

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

  @Post('/projects')
  @UseGuards(AuthGuard)
  createProject(
    @Body(
      new ValidationPipe({
        exceptionFactory: ValidationException.throwValidationException,
        forbidNonWhitelisted: true, // Add validation options here.
        whitelist: true,
      }),
    )
    createProjectDTO: createProjectDTO,
  ) {
    return this.userService.createProject(createProjectDTO, this.req.id);
  }
}
