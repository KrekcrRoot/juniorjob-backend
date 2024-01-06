import {
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SignInAuthDto } from './dto/signin-auth.dto';
import { Tokens } from './dto/tokens.dto';
import { SignUpAuthDto } from './dto/signup-auth.dto';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { TokenUpdateReq } from './dto/token-update-req.dto';
import { TokenRequest } from 'src/users/dto/token-request';
import responses from 'src/global/responses';

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
  signInLocal(@Body() loginAuthDto: SignInAuthDto) {
    return this.authService.signInLocal(loginAuthDto);
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
    description: 'JWT tokens after refreshing',
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'refresh tokens' })
  @HttpCode(HttpStatus.OK)
  @Post('/refresh')
  refresh(@Body() tokenUpdateReq: TokenUpdateReq) {
    return this.authService.refreshTokens(tokenUpdateReq);
  }

  @ApiResponse({
    status: HttpStatus.OK,
  })
  @ApiOperation({ summary: 'logout and clear tokens' })
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @Post('/logout')
  logout(@Req() req: TokenRequest) {
    if (!req.user['uuid'])
      throw new ForbiddenException(responses.accessTokenInvalid);
    return this.authService.logout(req.user['uuid']);
  }
}
