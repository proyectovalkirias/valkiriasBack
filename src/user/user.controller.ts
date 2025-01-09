
import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Put,
  UploadedFile,
  UseInterceptors,
  UseGuards
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import { User } from 'src/entities/user.entity';
import { UserDto } from 'src/dtos/userDto';
import { UpdateUserDto } from 'src/dtos/updateUserDto';
import { AuthGuard } from 'src/guards/auth.guard';
import { RoleGuard } from 'src/guards/role.guard';

import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Get All Users' })
  @UseGuards(AuthGuard, RoleGuard)
  @Get()
  getAllUser() {
    return this.userService.getAllUser();
  }

  @ApiOperation({ summary: 'Get User By Email' })
  @Get('email/:email')
  getUserByEmail(@Param('email') email: string) {
    return this.userService.getUserByEmail(email);
  }

  @ApiOperation({ summary: 'Deactivate User' })
  @UseGuards(AuthGuard, RoleGuard)
  @Put(':id/deactivate')
  deactivateUser(@Param('id') id: string) {
    return this.userService.deactiveUser(id);
  }

  @ApiOperation({ summary: 'Activate User' })
  @UseGuards(AuthGuard, RoleGuard)
  @Put(':id/activate')
  activateUser(@Param('id') id: string) {
    return this.userService.activeUser(id);
  }

  @ApiOperation({ summary: `Update Profile Image` })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Carga tu foto de perfil:',
    schema: {
      type: 'object',
      properties: { photo: { type: 'string', format: 'binary' } },
    },
  })
  @UseInterceptors(FileInterceptor('photo'))
  @Put(`updateProfileImg/:id`)
  updateProfileImg(
    @Param(`id`) id: string,
    @UploadedFile()
    photo: Express.Multer.File,
  ) {
    const userUpdated = this.userService.updateProfileImg(id, photo);
    return userUpdated;
  }

  @ApiOperation({ summary: 'Remove User' })
  @UseGuards(AuthGuard, RoleGuard)
  @Delete(':id/delete')
  removeUser(@Param('id') id: string) {
    return this.userService.removeUser(id);
  }

  @ApiOperation({ summary: 'Get User By Id' })
  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @ApiOperation({ summary: 'Update User' })
  @Put(':id')
  updateUser(@Param('id') id: string, @Body() updateUser: UpdateUserDto) {
    return this.userService.updateUser(id, updateUser);
  }
}
