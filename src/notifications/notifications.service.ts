import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { User } from '../users/user.entity';
import { SchedulerRegistry } from '@nestjs/schedule';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,
    private readonly schedulerRegistry: SchedulerRegistry,
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
        user: {
          uuid: user.uuid,
          deleted: false,
          banned: false,
        },
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

    const res = await this.notificationsRepository.save(notification);

    const callback = () => {
      this.notificationsRepository.delete(res.uuid);
      this.schedulerRegistry.deleteTimeout(`${res.uuid}`);
    };

    const timeout = setTimeout(callback, 60 * 1000);
    this.schedulerRegistry.addTimeout(`${res.uuid}`, timeout);

    return res;
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

  async all() {
    return this.notificationsRepository.find();
  }
}
