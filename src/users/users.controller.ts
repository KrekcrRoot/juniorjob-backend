import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { Roles } from 'src/roles/roles.decorator';
import { UserRole } from 'src/roles/role.enum';
import { RolesGuard } from 'src/roles/roles.guard';
import { TokenRequest } from './dto/token-request';
import { ChangePasswordDto } from './dto/change-password.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserUUID } from './dto/user-uuid.dto';
import { FileTypeValidationPipe } from 'src/vacancies/vacancies.image.pipe';
import constants from 'src/global/constants';
import * as fs from 'fs';
import { AllFilterDto } from './dto/all-users-filter.dto';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
  ) {}

  @ApiResponse({
    status: HttpStatus.OK,
    type: User,
    isArray: true,
    description: 'Response all users',
  })
  @ApiOperation({ summary: 'Find all users' })
  @ApiBearerAuth('access token')
  @UseGuards(AccessTokenGuard)
  @Get()
  getAll(@Query() query: AllFilterDto) {
    return this.usersService.getAllUsers(query);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: User,
    isArray: true,
    description: 'Find user by access token',
  })
  @ApiBearerAuth()
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
  @UseGuards(AccessTokenGuard)
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
  @UseGuards(AccessTokenGuard)
  @Get(':uuid')
  findByUUID(@Param() params: any): Promise<User | null> {
    return this.usersService.findByUUID(params.uuid);
  }

  @UseGuards(AccessTokenGuard)
  @UseInterceptors(FileInterceptor('image'))
  @ApiBearerAuth()
  @Post('/uploadImage')
  uploadImage(
    @Req() auth: TokenRequest,
    @UploadedFile(new FileTypeValidationPipe()) file: Express.Multer.File,
  ) {
    const filearr = file.originalname.split('.');
    const type = filearr[filearr.length - 1];

    const fileRaw = Date.now() + '.' + type;
    const filePwd = join(
      this.configService.get<string>('STORAGE_FOLDER'),
      constants.usersFolder,
      fileRaw,
    );
    fs.writeFileSync(filePwd, file.buffer);

    return this.usersService.updateImage(auth.user.uuid, fileRaw);
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
  changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req: TokenRequest,
  ) {
    return this.usersService.changePassword(changePasswordDto, req.user.uuid);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ban user',
  })
  @ApiOperation({ summary: 'Ban user (Moderator only)' })
  @Post('/ban')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(UserRole.Moderator)
  ban(@Body() userUUID: UserUUID) {
    return this.usersService.ban(userUUID.uuid);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ban user',
  })
  @ApiOperation({ summary: 'Ban user (Moderator only)' })
  @Post('/unban')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(UserRole.Moderator)
  unban(@Body() userUUID: UserUUID) {
    return this.usersService.unban(userUUID.uuid);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ban user',
  })
  @ApiOperation({ summary: 'Ban user (Moderator only)' })
  @Delete('/delete')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(UserRole.Moderator)
  delete(@Body() userUUID: UserUUID) {
    this.usersService.delete(userUUID.uuid);
  }
}
