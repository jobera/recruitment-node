import {
  Request,
  Controller,
  Post,
  UseGuards,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from 'src/entities/user.entity';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth.credentials.dto';
import { AccessToken } from './module';

@Controller('api/v1/auth/')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async signup(
    @Body() credentials: AuthCredentialsDto,
  ): Promise<Partial<UserEntity>> {
    return this.authService.signup(credentials);
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() { user }): Promise<AccessToken> {
    return this.authService.login(user);
  }
}
