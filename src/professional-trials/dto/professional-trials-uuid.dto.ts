import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProfessionalTrialsUuidDto {

  @ApiProperty({
    example: 'b75fe173-1e59-49ef-9527-ca2fd02bd75c',
    description: 'UUID of professional trial',
  })
  @IsUUID()
  @IsNotEmpty()
  professional_trial_uuid: string;

}