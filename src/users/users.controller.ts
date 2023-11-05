import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './user.entity';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiResponse({
    status: HttpStatus.OK,
    type: User,
    isArray: true,
    description: 'Response all users',
  })
  @ApiOperation({ summary: 'Find all users' })
  @Get()
  getAll(): Promise<User[]> {
    return this.usersService.getAllUsers();
  }
  
  @ApiResponse({
    status: HttpStatus.OK,
    type: User,
    description: 'Find user by email',
  })
  @ApiOperation({ summary: 'Find user by email' })
  @Get('email/:email')
  findByEmail(@Param() params: any): Promise<User | null> {
    return this.usersService.findOne(params.email);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: User,
    description: 'Find user by UUID',
  })
  @ApiOperation({ summary: 'Find user by UUID' })
  @Get(':uuid')
  findByUUID(@Param() params: any): Promise<User | null> {
    return this.usersService.findByUUID(params.uuid);
  }
}
