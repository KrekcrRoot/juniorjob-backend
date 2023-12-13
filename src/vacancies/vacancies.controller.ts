import { BadRequestException, UseInterceptors, Controller, Post, Get, HttpStatus, Param, UseGuards, Body, Req, Delete, Put, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, ForbiddenException } from '@nestjs/common';
import { VacanciesService } from './vacancies.service';
import { Vacancy } from './vacancy.entity';
import { isUUID } from 'class-validator';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { Roles } from 'src/roles/roles.decorator';
import { RolesGuard } from 'src/roles/roles.guard';
import { UserRole } from 'src/roles/role.enum';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { TokenRequest } from 'src/users/dto/token-request';
import { UsersService } from 'src/users/users.service';
import { UUIDVacancyDto } from './dto/uuid-vacancy.dto';
import { EditVacancyDto } from './dto/edit-vacancy.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileTypeValidationPipe } from './vacancies.image.pipe';
import constants from 'src/global/constants';
import responses from 'src/global/responses';
import * as fs from 'fs';
import { join } from 'path';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AllFilterDto } from 'src/users/dto/all-users-filter.dto';

@ApiTags('Vacancies')
@Controller('vacancies')
export class VacanciesController {

    constructor(private vacanciesService: VacanciesService, private usersSerivice: UsersService) {}

    // Post

    @ApiResponse({
        status: HttpStatus.OK,
        type: Vacancy,
        description: 'Response created vacancy',
    })
    @ApiOperation({ summary: 'Create new vacancy' })
    @ApiBearerAuth()
    @Post('/create')
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles(UserRole.Individual, UserRole.LegalEntity)
    async create(@Req() req: TokenRequest, @Body() createVacancyDto: CreateVacancyDto) {
        const user = await this.usersSerivice.findByUUID(req.user.uuid);
        return this.vacanciesService.create(createVacancyDto, user);
    }

    @ApiResponse({
        status: HttpStatus.OK,
        description: 'OK status',
        type: Vacancy,
    })
    @ApiOperation({
        summary: 'Ban vacancy by uuid',
    })
    @ApiBearerAuth()
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles(UserRole.Moderator)
    @Post('/ban')
    ban(@Body() banVacancyDto: UUIDVacancyDto) {
        return this.vacanciesService.ban(banVacancyDto.vacancy_uuid);
    }

    @ApiResponse({
        status: HttpStatus.OK,
        description: 'OK status',
        type: Vacancy,
    })
    @ApiOperation({
        summary: 'Unban vacancy by uuid',
    })
    @ApiBearerAuth()
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles(UserRole.Moderator)
    @Post('/unban')
    unban(@Body() banVacancyDto: UUIDVacancyDto) {
        return this.vacanciesService.unban(banVacancyDto.vacancy_uuid);
    }

    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles(UserRole.Individual, UserRole.LegalEntity, UserRole.Moderator)
    @Post('/uploadImage')
    @UseInterceptors(FileInterceptor('image'))
    async uploadFile(@Body() req: UUIDVacancyDto, @Req() auth: TokenRequest, @UploadedFile(new FileTypeValidationPipe()) file: Express.Multer.File) {

        const vacancy = await this.vacanciesService.findByUUID(req.vacancy_uuid);

        if(!vacancy) {
            throw new BadRequestException(responses.doesntExistUUID('Vacancy'));
        }

        if(auth.user.role != UserRole.Moderator && vacancy.employer.uuid != auth.user.uuid) {
            throw new ForbiddenException(responses.accessDenied);
        }

        const filearr = file.originalname.split('.');
        const type = filearr[filearr.length - 1];

        const fileName = constants.vacanciesFolder + Date.now() + '.' + type;
        fs.writeFileSync(__dirname + '/../..' + fileName, file.buffer);

        return this.vacanciesService.editImage(req.vacancy_uuid, fileName);
    }

    // Put

    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Edited vacancy',
        type: Vacancy,
    })
    @ApiOperation({
        summary: 'Edit vacancy'
    })
    @ApiBearerAuth()
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles(UserRole.Individual, UserRole.LegalEntity, UserRole.Moderator)
    @Put('/edit')
    edit(@Body() vacancyEditDto: EditVacancyDto, @Req() req: TokenRequest) {
        return this.vacanciesService.edit(vacancyEditDto, req.user);
    }

    // Delete

    @ApiResponse({
        status: HttpStatus.OK,
        description: 'OK status',
        type: Boolean,
    })
    @ApiOperation({
        summary: 'Delete vacancy by uuid',
    })
    @ApiBearerAuth()
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles(UserRole.Individual, UserRole.LegalEntity, UserRole.Moderator)
    @Delete('/delete')
    delete(@Req() req: TokenRequest, @Body() banVacancyDto: UUIDVacancyDto) {
        return this.vacanciesService.delete(banVacancyDto.vacancy_uuid, req.user);
    }

    // Get

    @ApiResponse({
        status: HttpStatus.OK,
        type: Vacancy,
        isArray: true,
        description: 'all vacancies',
    })
    @ApiOperation({ summary: 'Response all vacancies' })
    @Get('/all')
    getAll(@Body() filters: AllFilterDto) {
        return this.vacanciesService.all(filters);
    }

    @ApiResponse({
        status: HttpStatus.OK,
        type: Vacancy,
        isArray: true,
        description: 'All vacancies of employer'
    })
    @ApiOperation({ summary: 'Return all vacancies of employer' })
    @ApiBearerAuth()
    @UseGuards(AccessTokenGuard, RolesGuard)
    @Roles(UserRole.Individual, UserRole.LegalEntity)
    @Get('/my')
    async getMy(@Req() req: TokenRequest) {
        const user = await this.usersSerivice.findByUUID(req.user.uuid);
        return this.vacanciesService.getByEmployer(user);
    }

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
