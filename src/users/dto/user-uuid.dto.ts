import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";

export class UserUUID {
  @ApiProperty({
    example: '856227b0-9759-11ee-9ec1-0800200c9a66',
    description: 'user uuid',
  })
  @IsUUID()
  @IsNotEmpty()
  uuid: string;
}