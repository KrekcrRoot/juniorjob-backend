import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../users/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginAuthDto } from './dto/login-auth.dto';

class AuthResponse {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    description: 'JWT access token',
  })
  access_token: string;
}

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiResponse({
    status: 200,
    type: AuthResponse,
    isArray: false,
    description: 'JWT tokens response',
  })
  @Post('/login')
  login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.signIn(loginAuthDto);
  }

  @ApiResponse({
    status: 200,
    type: User,
    isArray: false,
    description: '(temporary) Return user after registration',
  })
  @Post('/registration')
  registration(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.authService.registration(createUserDto);
  }
}
