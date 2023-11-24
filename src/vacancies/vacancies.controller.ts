import { BadRequestException, Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { VacanciesService } from './vacancies.service';
import { Vacancy } from './vacancy.entity';
import { isUUID } from 'class-validator';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Vacancies')
@Controller('vacancies')
export class VacanciesController {

    constructor(private vacanciesService: VacanciesService) {}

    @ApiResponse({
        status: HttpStatus.OK,
        type: Vacancy,
        description: 'Response vacancy by uuid',
    })
    @ApiOperation({ summary: 'Response vacancy by uuid' })
    @Get(':uuid')
    findByUUID(@Param() params: any): Promise<Vacancy | null> {
        if(!isUUID(params.uuid)) throw new BadRequestException('UUID is not valid');
        return this.vacanciesService.findByUUID(params.uuid);
    }


}
