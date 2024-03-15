import { BadRequestException, Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { TokenRequest } from '../users/dto/token-request';
import { Notification } from './notification.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import responses from '../global/responses';
import { UuidNotificationDto } from "./dto/uuid-notification.dto";

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(
    private notificationsService: NotificationsService,
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  @ApiResponse({
    description: 'All notification (ONLY FOR TEST)',
    type: Notification,
    isArray: true,
  })
  @ApiOperation({ summary: 'ONLY FOR TEST' })
  @UseGuards(AccessTokenGuard)
  @Get('/all')
  getAll() {
    return this.notificationsService.all();
  }

  @ApiResponse({
    description: '',
    type: Notification,
    isArray: true,
  })
  @ApiOperation({ summary: 'Get notifications by user auth' })
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @Get('/my')
  async getByToken(@Req() req: TokenRequest) {
    const user = await this.usersRepository.findOneBy({
      uuid: req.user.uuid,
      deleted: false,
      banned: false,
    });

    if (!user) throw new BadRequestException(responses.doesntExist('User'));

    return this.notificationsService.getByUser(user);
  }

  @ApiResponse({
    description: '',
    type: Notification,
    isArray: true,
  })
  @ApiOperation({ summary: 'View notification' })
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Post('/view')
  async view(@Req() req: TokenRequest, @Body() notificationUuid: UuidNotificationDto) {
    const user = await this.usersRepository.findOneBy({
      uuid: req.user.uuid,
      deleted: false,
      banned: false,
    });

    if(!user) throw new BadRequestException(responses.doesntExist('User'));

    const notification = await this.notificationsService.getByUUID(notificationUuid.uuid);
    return this.notificationsService.viewed(notification);
  }
}
