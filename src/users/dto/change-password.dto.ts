import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class ChangePasswordDto {
    
    @ApiProperty({
        example: '12345',
        description: 'Previous password',
    })
    @IsString()
    @MinLength(5)
    @IsNotEmpty()
    public previous_password: string;

    @ApiProperty({
        example: '54321',
        description: 'New password for user',
    })
    @IsString()
    @MinLength(5)
    @IsNotEmpty()
    public new_password: string;
}