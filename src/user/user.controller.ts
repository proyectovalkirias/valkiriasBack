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
import { UpdateUserDto } from 'src/dtos/updateUserDto';
import { Address } from 'src/entities/address.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService,
  @InjectRepository(User)
  private readonly userRepository: Repository<User>  
  ) {}

  @ApiOperation({ summary: 'Get All Users' })
  @UseGuards(AuthGuard, RoleGuard)
  @ApiBearerAuth()
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
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuard)
  @Put(':id/deactivate')
  deactivateUser(@Param('id') id: string) {
    return this.userService.deactiveUser(id);
  }

  @ApiOperation({ summary: 'Activate User' })
  @ApiBearerAuth()
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
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
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
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuard)
  @Put('changeIsAdmin/:id')
  changeIsAdmin(@Param('id') id: string) {
    return this.userService.changeIsAdmin(id);
  }

  @ApiOperation({ summary: 'Remove User' })
  @ApiBearerAuth()
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
  @ApiBody({
    type: UpdateUserDto,
    description: 'Datos para actualizar el usuario',
  })
  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() updateUser: UpdateUserDto) {
    
    if (updateUser.addresses) {
      
      if (Array.isArray(updateUser.addresses)) {
        for (const address of updateUser.addresses) {
          await this.userService.updateAddress(id, [address]);
        }
      } else {
        
        await this.userService.updateAddress(id, [updateUser.addresses]);
      }
    }

    const updatedUser = await this.userService.updateUser(id, updateUser);
    return updatedUser;
  }


  @ApiOperation({ summary: 'Delete Addresse'})
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete(':id/deleteAddress/:addressId')
  async deleteAddress(
    @Param('id') userId: string,
    @Param('addressId') addressId: string
  ){
   return await this.userService.removeAddress(userId, addressId);
  }

  @ApiOperation({summary: 'Get Address by'})
  @Get('address/:id')
  async getAddress(@Param('id') id: string) {
    return this.userService.getAddresses(id);
  }

  @ApiOperation({ summary: 'Get Address by Id'})
  @Get('addresses/:addressId')
  async getAddressById(
    @Param('addressId') addressId: string,
  ){
    return this.userService.getAddressById(addressId)
  }
}
