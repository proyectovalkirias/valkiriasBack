import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Length, Matches, Validate } from "class-validator";
import { matchPassword } from "src/utils/matchPassword.decorator";

export class UserDto {
    @ApiProperty({
        description: 'User firstname',
        example: 'Valkirias'
    })
    @IsNotEmpty()
    @IsString()
    @Length(3, 20)
    firstname: string;

    @ApiProperty({
        description: ' User lastname',
        example: 'Valkirias'
    })
    @IsNotEmpty()
    @IsString()
    @Length(3, 30)
    lastname: string;
    
    @ApiProperty({
        description: 'User Email',
        example: 'valkirias@test.com'
    })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'User password',
        example: 'Valkirias123'
    })
    @IsNotEmpty()
    @IsString()
    @Matches(
         /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,15}$/,
         {
            message: 'Password debe contener entre 8 y 15 caracteres, una mayuscula y una minuscula'
         },
        )
        password: string;

    @ApiProperty({
        description: 'Profile picture'
    })    
    @IsString()
    photo?: string;

    @ApiProperty({
        description: 'Google Token'
    })
    @IsString()
    googleAccessToken?: string;

    @ApiProperty({
        description: 'Password confirmation',
        example: 'Valkirias123'
    })    
    @IsNotEmpty()
    @Validate(matchPassword, ['password'])
    confirmPassword: string;


}