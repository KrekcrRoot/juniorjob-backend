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
import responses from 'src/global/responses';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationEnum } from '../notifications/notification.enum';
import notifications from '../global/notifications';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private citiesService: CitiesService,
    private configService: ConfigService,
    private notificationService: NotificationsService,
  ) {}

  async signInLocal(signInAuthDto: SignInAuthDto) {
    const user = await this.userService.findOne(signInAuthDto.email);

    if (!user) {
      throw new BadRequestException(responses.loginOrPasswordIncorrect);
    }

    const result = await argon2.verify(user.password, signInAuthDto.password);

    if (!result) {
      throw new UnauthorizedException(responses.loginOrPasswordIncorrect);
    }

    const payload: UserJwtDto = {
      uuid: user.uuid,
      email: user.email,
      role: user.role.current,
    };

    const tokens = await this.tokens(payload);
    await this.setRefreshToken(user.uuid, tokens.refresh_token);

    await this.notificationService.create({
      user: user,
      type: NotificationEnum.Warning,
      body: notifications.signIn,
    });

    return tokens;
  }

  async hashData(data: string) {
    return argon2.hash(data);
  }

  async signupLocal(signUpAuthDto: SignUpAuthDto): Promise<Tokens> {
    // Check user exists
    const userExists = await this.userService.findOne(signUpAuthDto.email);

    if (userExists) {
      throw new BadRequestException(responses.alreadyExist('User'));
    }

    // Check city exists
    const city = await this.citiesService.getCityByUUID(
      signUpAuthDto.city_uuid,
    );

    if (!city) {
      throw new BadRequestException(responses.doesntExist('City uuid'));
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
      role: user.role.current,
    };

    const tokens = await this.tokens(dto);
    await this.setRefreshToken(user.uuid, tokens.refresh_token);

    return tokens;
  }

  async setRefreshToken(user_uuid: string, refresh_token: string) {
    const hashedRefreshToken = await this.hashData(refresh_token);
    await this.userService.update_refresh_token(user_uuid, hashedRefreshToken);
  }

  async logout(user_uuid: string) {
    const user = await this.userService.findByUUID(user_uuid);

    if (user.hashedRefreshToken == null)
      throw new HttpException(
        responses.userIsNotLogged,
        HttpStatus.BAD_REQUEST,
      );

    user.hashedRefreshToken = null;
    const saved_user = await this.userService.saveUser(user);

    if (saved_user) {
      return {
        message: responses.logoutSuccess,
        statusCode: 200,
      };
    } else {
      return {
        message: responses.logoutUnsuccessed,
        statusCode: 500,
      };
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
        expiresIn: this.configService.get<string>(
          'JWT_REFRESH_EXPIRATION_TIME',
        ),
      }),
    ]);

    return {
      access_token,
      refresh_token,
    };
  }

  async refreshTokens(tokenUpdateReq: TokenUpdateReq) {
    const expired_access_token = this.jwtService.decode(
      tokenUpdateReq.access_token,
    ) as UserJwtDto;
    const user = await this.userService.findByUUID(expired_access_token.uuid);

    if (!user || !user.hashedRefreshToken)
      throw new ForbiddenException(responses.accessDenied);

    try {
      this.jwtService.verify(tokenUpdateReq.refresh_token, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
    } catch (error) {
      throw new ForbiddenException(responses.refreshTokenExpiredOrInvalid);
    }

    const token_verify = await argon2.verify(
      user.hashedRefreshToken,
      tokenUpdateReq.refresh_token,
    );

    if (!token_verify) throw new ForbiddenException(responses.accessDenied);

    const payload: UserJwtDto = {
      uuid: user.uuid,
      email: user.email,
      role: user.role.current,
    };

    const tokens = await this.tokens(payload);
    await this.setRefreshToken(user.uuid, tokens.refresh_token);

    return tokens;
  }
}
