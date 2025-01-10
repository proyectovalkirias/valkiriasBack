import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Matches, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'User firstname',
    example: 'Valkirias',
    required: false,
  })
  @IsString()
  @IsOptional()
  firstname?: string;

  @ApiProperty({
    description: 'User lastname',
    example: 'Valkirias',
    required: false,
  })
  @IsString()
  @IsOptional()
  lastname?: string;

  @ApiProperty({
    description: 'User password',
    example: 'Valkirias123',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,15}$/, {
    message:
      'Password debe contener entre 8 y 15 caracteres, una mayuscula y una minuscula',
  })
  password?: string;

  @ApiProperty({
    description: 'User DNI',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  dni?: number;

  @ApiProperty({
    description: 'User phone',
    required: false,
  })
  @IsOptional()
  phone?: string;


  @ApiProperty({
    example: [
      {
        street: 'Juan Bautista Alberdi',
        number: 111,
        postalCode: '1688',
        city: 'Buenos Aires',
        state: 'Buenos Aires',
      },
    ],
    description: 'User Addresses',
    type: [Object],
  })
  addresses?: {
    street: string;
    number: number;
    postalCode: string;
    city: string;
    state: string;
  }[];

  @ApiProperty({
    description: 'Profile picture',
    required: false,
  })
  @IsString()
  @IsOptional()
  photo?: string;
}
