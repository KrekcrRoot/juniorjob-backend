import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  @Get()
  @ApiTags(`Пользователи`)
  @ApiOperation({ summary: `Получение ответа в виде приветствия` })
  @ApiResponse({ status: 200, description: `Just response hi`, type: String })
  test(): string {
    return `Hi!`;
  }
}
