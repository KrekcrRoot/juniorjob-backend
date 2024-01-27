import { BadGatewayException, BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { MarkEnum, Review } from './review.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ReviewStoreDto } from './dto/review-store.dto';
import { User } from '../users/user.entity';
import { Applicant } from '../roles/models/applicant-role.entity';
import responses from '../global/responses';
import { all } from 'axios';

@Injectable()
export class ReviewsService {

  constructor(
    @InjectRepository(Review) private reviewsRepository: Repository<Review>,
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Applicant) private applicantsRepository: Repository<Applicant>,
  ) {}

  async applicant(uuid: string) {
    return this.reviewsRepository.find({
      where: {
        applicant: {
          uuid: uuid,
        },
        deleted: false,
        banned: false,
      },
    });
  }

  async make(employer_uuid: string, applicant_uuid: string, reviewStoreDto: ReviewStoreDto) {
    
    const employer = await this.usersRepository.findOneBy({
      uuid: employer_uuid,
      deleted: false,
      banned: false,
    });

    if(!employer) throw new BadGatewayException(responses.doesntExist('Employer'));

    const applicant = await this.applicantsRepository.findOneBy({
      uuid: applicant_uuid,
    });

    if(!applicant) throw new BadRequestException(responses.doesntExist('Applicant'));

    const review = this.reviewsRepository.create({
      author: employer,
      applicant: applicant,
      mark: reviewStoreDto.mark,
      body: reviewStoreDto.body,
    });

    return this.reviewsRepository.save(review);
  }

  async mark(applicant_uuid: string) {
    const marks = await this.reviewsRepository.find({
      where: {
        applicant: {
          uuid: applicant_uuid,
        },
      },
    });

    let allMarks = 0, count = 0;
    marks.forEach(el => {
      if(el.mark != MarkEnum.Empty) {
        allMarks += el.mark;
        count++;
      }
    });

    return Math.round(allMarks / count);
  }

}
