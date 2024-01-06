import { Controller, Get, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
  @UseGuards(AccessTokenGuard)
  @Get('/all')
  getAll() {
    return 1;
  }
}
