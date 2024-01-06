import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { User } from '../users/user.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,
  ) {}

  async getByUUID(uuid: string) {
    return this.notificationsRepository.findOne({
      where: {
        uuid: uuid,
        deleted: false,
      },
    });
  }

  async getByUser(user: User) {
    return this.notificationsRepository.find({
      where: {
        user: user,
        deleted: false,
      },
    });
  }

  async create(
    createNotificationDto: CreateNotificationDto,
  ): Promise<Notification> {
    const notification = this.notificationsRepository.create({
      ...createNotificationDto,
    });

    return await this.notificationsRepository.save(notification);
  }

  async viewed(notification: Notification): Promise<Notification> {
    notification.viewed = true;
    return this.notificationsRepository.save(notification);
  }

  async delete(notification: Notification): Promise<boolean> {
    notification.deleted = false;
    await this.notificationsRepository.save(notification);

    return true;
  }
}
