import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class UUIDVacancyDto {
    @ApiProperty({
        example: 'e43df318-85a6-4c7d-a659-3ca3f5f376ee',
        description: 'Vacancy uuid',
    })
    @IsString()
    @IsUUID('4')
    @IsNotEmpty()
    vacancy_uuid: string;
}