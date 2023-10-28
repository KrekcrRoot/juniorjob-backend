import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './user.entity';
import { UsersService } from './users.service';

@ApiTags('Пользователи')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiResponse({
    status: 200,
    type: User,
    isArray: true,
    description: 'Получение всех пользователей',
  })
  @ApiOperation({ summary: 'Получение всех пользователей' })
  @Get()
  getAll(): Promise<User[]> {
    return this.usersService.getAllUsers();
  }
}
