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
  Param,
} from '@nestjs/common';
import { userService } from './user.service';
import { AuthGuard } from 'src/auth/guards/authGuard';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { ApiHeader } from '@nestjs/swagger';
import { createProjectDTO } from './dtos/createProject.dto';
import { ValidationException } from 'src/utils/exception/ValidationException';
import { ServiceList } from './types/ServiceList';
import { toggleServiceDTO } from './dtos/toggleService.dto';

// @ApiHeader({ name: 'Authorization', required: true })
@Controller('user')
export class userController {
  private readonly logger = new Logger('userController');

  constructor(
    private readonly userService: userService,
    @Inject(REQUEST) private readonly req: Request,
  ) {}

  @Get('/') // route
  @ApiHeader({ name: 'Authorization', required: true })
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

  @Get('/projects/:projectId') // route
  @ApiHeader({ name: 'Authorization', required: true })
  @UseGuards(AuthGuard)
  @HttpCode(201) // Return type
  getProject(@Param('projectId') projectId: string) {
    console.log('everythign : ', projectId, this.req.id);
    return this.userService.getProject(projectId, this.req.id);
  }

  @Post('/projects/:projectId/services/:serviceName/toggle')
  @UseGuards(AuthGuard)
  toggleService(
    @Param('projectId') projectId: string,
    @Param(
      new ValidationPipe({
        exceptionFactory: ValidationException.throwValidationException,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
      }),
    )
    toggleServiceDTO: toggleServiceDTO,
  ) {
    console.log(toggleServiceDTO);
    return this.userService.toggleService(
      projectId,
      this.req.id,
      toggleServiceDTO.serviceName,
      this.req.token,
    );
  }
}
