import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, Matches } from "class-validator";

export class LoginDto {
    @ApiProperty({
        description: 'User Email',
        example: 'valkirias@test.com'
    })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'User Password',
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
}