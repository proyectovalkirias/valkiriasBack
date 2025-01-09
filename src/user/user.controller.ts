import { Body, Controller, Delete, Get, Param, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { User } from 'src/entities/user.entity';
import { UserDto } from 'src/dtos/userDto';
import { UpdateUserDto } from 'src/dtos/updateUserDto';
import { AuthGuard } from 'src/guards/auth.guard';
import { RoleGuard } from 'src/guards/role.guard';

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
