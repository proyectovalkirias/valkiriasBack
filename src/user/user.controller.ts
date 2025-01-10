import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { RoleGuard } from 'src/guards/role.guard';

import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/utils/Role/role.decorator';
import { Role } from 'src/utils/Role/role.enum';
import { UpdateUserDto } from 'src/dtos/updateUserDto';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Get All Users' })
  @Roles(Role.Admin)
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
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RoleGuard)
  @Put(':id/deactivate')
  deactivateUser(@Param('id') id: string) {
    return this.userService.deactiveUser(id);
  }

  @ApiOperation({ summary: 'Activate User' })
  @Roles(Role.Admin)
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

  @ApiOperation({ summary: 'Update User To Admin' })
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RoleGuard)
  @Put('changeIsAdmin/:id')
  changeIsAdmin(@Param('id') id: string) {
    return this.userService.changeIsAdmin(id);
  }

  @ApiOperation({ summary: 'Remove User' })
  @Roles(Role.Admin)
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
  @ApiBody({ type: UpdateUserDto, description: 'Datos para actualizar el usuario' })
  @Put(':id')
  updateUser(@Param('id') id: string, @Body() updateUser: UpdateUserDto) {
    return this.userService.updateUser(id, updateUser);
  }
}
