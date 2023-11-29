import { BadRequestException, Controller, Post, Get, HttpStatus, Param, UseGuards, Body, Req, Delete, Put } from '@nestjs/common';
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
import { UserJwtDto } from 'src/users/dto/user-jwt.dto';

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
    getAll() {
        return this.vacanciesService.all();
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
