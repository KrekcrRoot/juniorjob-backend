import { User } from '../../users/user.entity';
import { NotificationEnum } from '../notification.enum';

export class CreateNotificationDto {
  user: User;
  type: NotificationEnum;
  body: string;
}
