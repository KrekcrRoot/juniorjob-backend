import { BadRequestException, Body, Controller, HttpCode, HttpException, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SignInAuthDto } from './dto/signin-auth.dto';
import { Tokens } from './dto/tokens.dto';
import { SignUpAuthDto } from './dto/signup-auth.dto';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { UserJwtDto } from 'src/users/dto/user-jwt.dto';
import { isJWT } from 'class-validator';

interface tokenRequest extends Request {
  user: UserJwtDto;
}


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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'refresh tokens' })
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @Post('/refresh')
  refresh(@Req() req: tokenRequest) {
    const refresh_token = req.body['refresh_token'];
    if(!refresh_token) {
      throw new BadRequestException('Refresh token is required');
    }

    if(!isJWT(refresh_token)) {
      throw new BadRequestException('Refresh token must be JWT');
    }

    return this.authService.refreshTokens(req.user, refresh_token);
  }

  @ApiResponse({
    status: HttpStatus.OK,
  })
  @ApiOperation({ summary: 'logout and clear tokens' })
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @Post('/logout')
  logout(@Req() req: Request) {
    console.log(req);
    // return this.authService.logout(req);
  }
}
