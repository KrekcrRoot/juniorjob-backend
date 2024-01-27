import { Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './review.entity';
import { ReviewsService } from './reviews.service';
import { User } from '../users/user.entity';
import { Applicant } from '../roles/models/applicant-role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Review, User, Applicant])],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
