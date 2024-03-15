import { IsNotEmpty, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UuidNotificationDto {
  @ApiProperty({
    example: 'c7e0c7b5-3569-4774-95c1-cd4b9df86535',
    description: 'uuid of notification',
  })
  @IsUUID()
  @IsNotEmpty()
  uuid: string;
}