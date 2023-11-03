import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignInAuthDto } from './dto/signin-auth.dto';
import { SignUpAuthDto } from './dto/signup-auth.dto';
import { CitiesService } from 'src/cities/cities.service';
import { Tokens } from './dto/tokens.dto';
import { UserJwtDto } from 'src/users/dto/user-jwt.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private citiesService: CitiesService,
    private configService: ConfigService,
  ) {}

  async signinLocal(signInAuthDto: SignInAuthDto) {
    const user = await this.userService.findOne(signInAuthDto.email);

    if (!user) {
      throw new BadRequestException('There is no user with this email');
    }

    const result = await bcrypt.compare(signInAuthDto.password, user.password);

    if (!result) {
      throw new UnauthorizedException();
    }

    const payload = {
      user_id: user.uuid,
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

  async signupLocal(signUpAuthDto: SignUpAuthDto): Promise<Tokens> {

    // Check user exists
    const userExists = await this.userService.findOne(signUpAuthDto.email);

    if (userExists) {
      throw new BadRequestException('User already exist');
    }

    // Check city exists
    const city = await this.citiesService.getCityByUUID(signUpAuthDto.city_uuid);

    if (!city) {
      throw new BadRequestException('City uuid doesn\'t exist');
    }

    // Creating user
    const user = await this.userService.createUser({
      email: signUpAuthDto.email,
      password: signUpAuthDto.password,
      city: city,
    });

    const dto: UserJwtDto = {
      uuid: user.uuid,
      email: user.email,
    }

    const tokens = await this.tokens(dto);
    await this.updateRefreshToken(user.uuid, tokens.refresh_token);

    return tokens;

  }

  async updateRefreshToken(user_uuid: string, refresh_token: string) {
    const hashedRefreshToken = await bcrypt.hash(refresh_token, 10);
    this.userService.update(user_uuid, hashedRefreshToken);
  }

  async logout() {}



  // Working with tokens

  async tokens(payload: UserJwtDto) {
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRATION_TIME'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION_TIME'),
      })
    ]);

    return {
      access_token,
      refresh_token,
    };
  }

}
