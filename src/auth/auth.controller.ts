import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  ValidationPipe,
  Logger,
  Query,
} from '@nestjs/common';
import { ValidationException } from '../utils/exception/ValidationException';
import { ApiBody } from '@nestjs/swagger';
import { authService } from './auth.service';
import { registerUserDTO } from './dto/registerUser.dto';
import { loginUserDTO } from './dto/loginUser.dto';
import { googleLoginDTO } from './dto/googleLogin.dto';

@Controller('auth')
export class authController {
  private readonly logger = new Logger('authController');

  constructor(private readonly authService: authService) {}

  @Get()
  getHello(): string {
    return 'hello world';
  }

  @Post('/register') // route
  @HttpCode(201) // Return type
  registerUser(
    @Body(
      new ValidationPipe({
        exceptionFactory: ValidationException.throwValidationException,
        forbidNonWhitelisted: true, // Add validation options here.
        whitelist: true,
      }),
    )
    registerUserDTO: registerUserDTO,
  ) {
    return this.authService.registerUser(registerUserDTO);
  }

  @Post('/login') // route
  @HttpCode(200) // Return type
  loginUser(
    @Body(
      new ValidationPipe({
        exceptionFactory: ValidationException.throwValidationException,
        forbidNonWhitelisted: true, // Add validation options here.
        whitelist: true,
      }),
    )
    loginUserDTO: loginUserDTO,
  ) {
    return this.authService.loginUser(loginUserDTO);
  }

  @Post('/verifyEmail') // route
  @HttpCode(200) // Return type
  verifyUserRegistration(@Query('token') token: string) {
    return this.authService.verifyUserRegistration(token);
  }

  @Post('/googleLogin') // route
  @HttpCode(200) // Return type
  loginWithGoogle(
    @Body(
      new ValidationPipe({
        exceptionFactory: ValidationException.throwValidationException,
        forbidNonWhitelisted: true, // Add validation options here.
        whitelist: true,
      }),
    )
    googleLoginDTO: googleLoginDTO,
  ) {
    return this.authService.loginWithGoogle(googleLoginDTO);
  }
}
