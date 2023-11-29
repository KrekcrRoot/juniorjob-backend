import { IsNotEmpty, IsString, IsUUID } from "class-validator";
import { CreateVacancyDto } from "./create-vacancy.dto";
import { ApiProperty } from "@nestjs/swagger";

export class EditVacancyDto extends CreateVacancyDto {
    @ApiProperty({
        example: '51741c2f-49d6-4dac-b9cb-bb311736ccf3',
        description: 'UUID of vacancy'
    })
    @IsString()
    @IsUUID('4')
    @IsNotEmpty()
    uuid: string;
}