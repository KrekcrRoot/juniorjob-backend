import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { JwtGlobal } from '../global/jwt-global';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';

@Module({
  imports: [UsersModule, JwtGlobal],
  providers: [AccessTokenStrategy, RefreshTokenStrategy],
})
export class AuthModule {}
