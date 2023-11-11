import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class ModeratorUpdateDto {

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'name',
    description: 'Moderator name',
  })
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'surname',
    description: 'Moderator surname',
  })
  surname: string;

}