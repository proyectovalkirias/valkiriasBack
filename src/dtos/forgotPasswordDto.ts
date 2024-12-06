import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, Validate } from 'class-validator';
import { matchPassword } from 'src/utils/matchPassword.decorator';

export class forgotPasswordDto {
  @ApiProperty({
    description: 'User password',
    example: 'Valkirias123',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,15}$/, {
    message:
      'Password debe contener entre 8 y 15 caracteres, una mayuscula y una minuscula',
  })
  password: string;

  @ApiProperty({
    description: 'Password confirmation',
    example: '#Valkirias123',
  })
  @IsNotEmpty()
  @Validate(matchPassword, ['password'])
  confirmPassword: string;
}
