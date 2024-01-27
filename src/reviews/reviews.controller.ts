import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';
import { UserUUID } from '../users/dto/user-uuid.dto';
import { ReviewsService } from './reviews.service';
import { ReviewStoreDto } from './dto/review-store.dto';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { UserRole } from '../roles/role.enum';
import { TokenRequest } from '../users/dto/token-request';
import { ApiBearerAuth, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';

class Mark {
  @ApiProperty({
    example: 5,
    description: 'mark of applicant',
  })
  mark: Number;
}

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {

  constructor(private reviewsService: ReviewsService) {}

  @ApiResponse({
    description: 'Mark response',
    type: Mark,
  })
  @Get('/mark/applicant/:uuid')
  markApplicant(@Param() params: UserUUID) {
    return {
      mark: this.reviewsService.mark(params.uuid),
    };
  }

  @Get('/applicant/:uuid')
  allByApplicant(@Param() params: UserUUID) {
    return this.reviewsService.applicant(params.uuid);
  }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(UserRole.Individual, UserRole.Moderator, UserRole.Moderator)
  @Post('/applicant/:uuid')
  storeApplicant(@Param() params: UserUUID, @Body() reviewStoreDto: ReviewStoreDto, @Req() tokenRequest: TokenRequest) {
    return this.reviewsService.make(tokenRequest.user.uuid, params.uuid, reviewStoreDto);
  }

}
