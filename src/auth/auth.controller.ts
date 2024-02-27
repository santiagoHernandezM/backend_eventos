import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto, UserLoginDto } from 'src/users/dto/user.dto';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({
    type: UserLoginDto,
  })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() sigInDto: UserLoginDto) {
    return this.authService.signIn(sigInDto);
  }

  @Get('/logueado')
  @UseGuards(JwtAuthGuard)
  logueado() {
    return {
      message: 'Bienvenido',
      status: 'Logueado',
    };
  }

  @Get('prueba')
  @UseGuards(AuthGuard())
  prueba() {
    return {
      message: 'Bienvenido',
      status: 'prueba',
    };
  }
}
