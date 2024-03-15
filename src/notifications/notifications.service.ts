import { BadRequestException, Injectable, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Notification } from "./notification.entity";
import { CreateNotificationDto } from "./dto/create-notification.dto";
import { User } from "../users/user.entity";
import { SchedulerRegistry } from "@nestjs/schedule";
import { ConfigService } from "@nestjs/config";
import responses from "../global/responses";

@Injectable()
export class NotificationsService implements OnModuleInit {

  notificationsTimeout: number;

  constructor(
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,
    private readonly schedulerRegistry: SchedulerRegistry,
    private configService: ConfigService,
  ) {}

  async getByUUID(uuid: string) {
    const notification = await this.notificationsRepository.findOne({
      where: {
        uuid: uuid,
        deleted: false,
      },
    });

    if(!notification) throw new BadRequestException(responses.doesntExistUUID('Notification'));

    return notification;
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

  createSync(createNotificationDto: CreateNotificationDto) {
    this.create(createNotificationDto).then();
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
    const callback = () => {
      this.notificationsRepository.delete(notification.uuid);
      this.schedulerRegistry.deleteTimeout(`${notification.uuid}`);
    };

    const timeout = setTimeout(callback, this.notificationsTimeout);
    this.schedulerRegistry.addTimeout(`${notification.uuid}`, timeout);

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

  onModuleInit(): void {

    const days = this.configService.get<number>('NOTIFICATION_TIMEOUT');
    this.notificationsTimeout = days * 24 * 60 * 60 * 1000;

  }
}
