import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../users/user.entity';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SignInAuthDto } from './dto/signin-auth.dto';
import { Tokens } from './dto/tokens.dto';
import { SignUpAuthDto } from './dto/signup-auth.dto';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiResponse({
    status: HttpStatus.OK,
    type: Tokens,
    isArray: false,
    description: 'JWT tokens after signIn',
  })
  @ApiOperation({ summary: 'authorization → signIn (Login)' })
  @Post('/local/signin')
  @HttpCode(HttpStatus.OK)
  signinLocal(@Body() loginAuthDto: SignInAuthDto) {
    return this.authService.signinLocal(loginAuthDto);
  }

  @ApiResponse({
    status: HttpStatus.CREATED,
    type: Tokens,
    isArray: false,
    description: 'JWT tokens after signUp',
  })
  @ApiOperation({ summary: 'authorization → signUp (Registration)' })
  @Post('/local/signup')
  @HttpCode(HttpStatus.CREATED)
  signupLocal(@Body() signUpAuthDto: SignUpAuthDto): Promise<Tokens> {
    return this.authService.signupLocal(signUpAuthDto);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: Tokens,
    description: 'JWT tokens after refreshing'
  })
  @ApiOperation({ summary: 'refresh tokens' })
  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  refresh(@Body() refresh: any) {
    return this.authService.updateRefreshToken();
  }

  @ApiResponse({
    status: HttpStatus.OK,
  })
  @ApiOperation({ summary: 'logout and clear tokens' })
  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  logout() {
    return this.authService.logout();
  }
}
