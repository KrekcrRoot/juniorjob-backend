import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { JwtGlobal } from '../global/jwt-global';

@Module({
  imports: [UsersModule, JwtGlobal],
})
export class AuthModule {}
