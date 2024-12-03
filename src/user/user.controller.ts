import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { User } from 'src/entities/user.entity';
import { UserDto } from 'src/dtos/userDto';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Get All Users' })
  @Get()
  getAllUser() {
    return this.userService.getAllUser();
  }

  @ApiOperation({ summary: 'Get User By Email' })
  @Get(':email')
  getUserByEmail(@Param('email') email: string) {
    return this.userService.getUserByEmail(email);
  }
  
  
  @ApiOperation({ summary: 'Deactivate User'})
  @Put(':id/deactivate')
  deactivateUser(@Param('id') id: string){
    return this.userService.deactiveUser(id);
  }
  
  @ApiOperation({ summary: 'Activate User' })
  @Put(':id/activate')
  activateUser(@Param('id') id: string){
    return this.userService.activeUser(id)
  }
  
  @ApiOperation({ summary: 'Remove User' })
  @Delete(':id/delete')
  removeUser(@Param('id') id: string) {
    return this.userService.removeUser(id)
  }
  
  @ApiOperation({ summary: 'Update User' })
  @Put(':id')
  udpdateUser(@Param('id') id: string, @Body() updateUser: UserDto) {
    return this.userService.updateUser(id, updateUser);
  }
  
  @ApiOperation({ summary: 'Get User By Id' })
  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }
}
