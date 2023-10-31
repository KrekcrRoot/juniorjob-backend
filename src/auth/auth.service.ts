import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginAuthDto } from './dto/login-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(loginAuthDto: LoginAuthDto) {
    const user = await this.userService.findOne(loginAuthDto.email);

    if (!user) {
      throw new BadRequestException('There is no user with this email');
    }

    const result = await bcrypt.compare(loginAuthDto.password, user.password);

    if (!result) {
      throw new UnauthorizedException();
    }

    const payload = {
      user_id: user.id,
      user_banned: user.banned,
      user_email: user.email,
      user_city: user.city,
      user_photo: user.photo,
    };

    const jwtResult = await this.jwtService.signAsync(payload);

    return {
      access_token: jwtResult,
    };
  }

  async registration(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.userService.findOne(createUserDto.email);

    if (user) {
      throw new BadRequestException('User already exist');
    }

    return this.userService.createUser(createUserDto);
  }
}
