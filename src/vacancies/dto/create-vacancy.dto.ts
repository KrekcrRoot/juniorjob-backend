import { IsBoolean, IsNotEmpty, IsString, IsUUID, MaxLength } from "class-validator";
import { VacancyCategory } from "../vacancy-category.entity";
import { ApiProperty } from "@nestjs/swagger";

export class CreateVacancyDto {
    @ApiProperty({
        example: 'Pellentesque dapibus non efficitur dolor integer',
        description: 'Vacancy title',
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(512)
    public title: string;

    @ApiProperty({
        example: 'b5c14ce9-3830-4ce3-adb0-09e1a4cc0406',
        description: 'Category uuid of vacancy',
    })
    @IsNotEmpty()
    @IsUUID('4')
    public category_uuid: string;

    @ApiProperty({
        example: '14:00 - 17:00 12.02.2023 - 24.02.2023',
        description: 'Time of vacancy',
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(2048)
    public time: string;
    
    @ApiProperty({
        example: 'Somewhere',
        description: 'Place of vacancy',
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(2048)
    public place: string;

    @ApiProperty({
        example: 'Efficitur malesuada pellentesque velit lacinia morbi amet, ornare orci, sed nulla faucibus. Sapien dui pulvinar nulla sed morbi mattis non vel mattis integer et. Est. Odio. Pellentesque lectus in imperdiet sodales sapien imperdiet morbi lectus mattis ornar',
        description: 'Description of vacancy',
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(8192)
    public description: string;

    @ApiProperty({
        example: true,
        description: 'Is this vacancy requires experience',
    })
    @IsNotEmpty()
    @IsBoolean()
    public required_experience: boolean;

    @ApiProperty({
        example: false,
        description: 'Multiple applicants may apply for this position',
    })
    @IsNotEmpty()
    @IsBoolean()
    public several_applicants: boolean;
}