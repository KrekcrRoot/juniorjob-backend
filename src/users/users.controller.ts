import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { Roles } from 'src/roles/roles.decorator';
import { UserRole } from 'src/roles/role.enum';
import { RolesGuard } from 'src/roles/roles.guard';
import { TokenRequest } from './dto/token-request';
import { ChangePasswordDto } from './dto/change-password.dto';

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
  @ApiBearerAuth('access token')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(UserRole.Moderator)
  @Get()
  getAll(@Req() req: TokenRequest): Promise<User[]> {
    return this.usersService.getAllUsers();
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: User,
    isArray: true,
    description: 'Find user by access token',
  })
  @ApiOperation({ summary: 'Find user by access token' })
  @UseGuards(AccessTokenGuard)
  @Get('/my')
  getInfoByToken(@Req() req: TokenRequest) {
    return this.usersService.findByUUID(req.user.uuid);
  }
  
  @ApiResponse({
    status: HttpStatus.OK,
    type: User,
    description: 'Find user by email',
  })
  @ApiOperation({ summary: 'Find user by email' })
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(UserRole.Moderator)
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
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(UserRole.Moderator)
  @Get(':uuid')
  findByUUID(@Param() params: any): Promise<User | null> {
    return this.usersService.findByUUID(params.uuid);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: Boolean,
    description: 'Change user password',
  })
  @ApiOperation({ summary: 'Change user password' })
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Post('/changePassword')
  changePassword(@Body() changePasswordDto: ChangePasswordDto, @Req() req: TokenRequest) {
    return this.usersService.changePassword(changePasswordDto, req.user.uuid);
  }

  @Post('/ban')
  ban() {}

  @Post('/unban')
  unban() {}

  @Delete('/delete')
  delete() {}
}
