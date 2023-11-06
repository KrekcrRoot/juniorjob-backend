import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { SignInAuthDto } from './dto/signin-auth.dto'; 
import { SignUpAuthDto } from './dto/signup-auth.dto';
import { CitiesService } from 'src/cities/cities.service';
import { Tokens } from './dto/tokens.dto';
import { UserJwtDto } from 'src/users/dto/user-jwt.dto';
import { ConfigService } from '@nestjs/config';
import { TokenUpdateReq } from './dto/token-update-req.dto';

@Injectable()
export class AuthService {

  saltOrRounds = 10;

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

    const result = await argon2.verify(user.password, signInAuthDto.password);

    if (!result) {
      throw new UnauthorizedException('Login or password is incorrect');
    }

    const payload: UserJwtDto = {
      uuid: user.uuid,
      email: user.email,
    }

    const tokens = await this.tokens(payload);
    this.setRefreshToken(user.uuid, tokens.refresh_token);

    return tokens;
  }

  async hashData(data: string) {
    return argon2.hash(data);
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
    await this.setRefreshToken(user.uuid, tokens.refresh_token);

    return tokens;
  }

  async setRefreshToken(user_uuid: string, refresh_token: string) {
    const hashedRefreshToken = await this.hashData(refresh_token);
    this.userService.update_refresh_token(user_uuid, hashedRefreshToken);
  }

  async logout(user_uuid: string) {
    let user = await this.userService.findByUUID(user_uuid);

    if(user.hashedRefreshToken == null) throw new HttpException('User is not logged', HttpStatus.BAD_REQUEST);

    user.hashedRefreshToken = null;
    const saved_user = await this.userService.saveUser(user);

    if(saved_user) {
      return {
        message: 'Logout success',
        statusCode: 200,
      }
    } else {
      return {
        message: 'Logout unsuccessed',
        statusCode: 500,
      }
    }

  }



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

  async refreshTokens(tokenUpdateReq: TokenUpdateReq) {

    const expired_access_token = this.jwtService.decode(tokenUpdateReq.access_token) as UserJwtDto;
    let user = await this.userService.findByUUID(expired_access_token.uuid);
    
    if(!user || !user.hashedRefreshToken) throw new ForbiddenException('Access denied');

    try {
      this.jwtService.verify(tokenUpdateReq.refresh_token, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      })
    } catch(error) {
      throw new ForbiddenException('Refresh token expired or invalid');
    }

    const token_verify = await argon2.verify(user.hashedRefreshToken, tokenUpdateReq.refresh_token);

    if(!token_verify) throw new ForbiddenException('Access denied');

    const payload: UserJwtDto = {
      uuid: user.uuid,
      email: user.email,
    }

    const tokens = await this.tokens(payload);
    this.setRefreshToken(user.uuid, tokens.refresh_token);

    return tokens;
  }
}
