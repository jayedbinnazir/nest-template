import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  Req,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { JwtCookieGuard } from 'src/auth/guards/jwt-cookie.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { HttpStatusCode } from 'axios';
import { MulterConfigService } from '../../files/services/multer.config.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly multerConfigService: MulterConfigService,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  //Api For Authenticated |Users

  @UseGuards(JwtCookieGuard)
  @Get('me')
  async findOne(@Req() req) {
    try {
      const userId = req.user['id']; // Assuming user ID is stored in the request object
      console.log('Finding user with ID:', userId);
      console.log('Request user:', req.user);
      return {
        status: 'success',
        code: HttpStatusCode.Ok,
        message: 'User found successfully',
        user: await this.userService.genericfindOne({ id: userId }),
      };
    } catch (error) {
      console.error('Error in findOne:', error);
      throw error; // Re-throw the error to be handled by global exception filter
    }
  }

  @UseGuards(JwtCookieGuard)
  @Patch('update')
  @HttpCode(200) // 200 OK
  @UseInterceptors(FileInterceptor('profile_pic')) // Assuming you want to handle file uploads
  async update(
    @Req() request,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const userId = request.user['id']; // Assuming user ID is stored in the request object
    try {
      updateUserDto.profile_picture = file; // Attach the file to the DTO
      const updatedUser = await this.userService.update(userId, updateUserDto);

      return {
        message: 'User updated successfully',
        user: updatedUser,
        status: 'success',
        code: HttpStatusCode.Ok,
      };
    } catch (error) {
      console.error('Error in update:', error);
      await this.multerConfigService.removeFile(
        updateUserDto.profile_picture?.path,
      );
      throw error; // Re-throw the error to be handled by global exception filter
    }
  }

  @Delete('soft/:id')
  softRemove(@Param('id') id: string) {
    try {
      return this.userService.softRemove(id);
    } catch (error) {
      console.error('Error in softRemove:', error);
      throw error; // Re-throw the error to be handled by global exception filter
    }
  }

  @Post(':id')
  @HttpCode(200) // 200 OK
  async restore(@Param('id') id: string) {
    try {
      const restored = await this.userService.recover(id);
      return {
        message: 'User restored successfully',
        user: restored,
        status: 'success',
        code: HttpStatusCode.Ok,
      };
    } catch (error) {
      console.error('Error in restore:', error);
      throw error; // Re-throw the error to be handled by global exception filter
    }
  }

  @Delete('hard/:id')
  hardDelete(@Param('id') id: string) {
    try {
      return this.userService.deletUser(id);
    } catch (error) {
      console.error('Error in softRemove:', error);
      throw error; // Re-throw the error to be handled by global exception filter
    }
  }

  // @Post("assignRole/:userId")
  // async assignRole(
  //   @Param('userId') userId: string,
  //   @Body("roleId") roleId:string,  
  // ) {
  //   try {
  //     const result = await this.userService.assignRoleToUser(userId, roleId);
  //     return {
  //       message: 'Role assigned successfully',
  //       result,
  //       status: 'success',
  //       code: HttpStatusCode.Ok,
  //     };
  //   } catch (error) {
  //     console.error('Error in assignRole:', error);
  //     throw error; // Re-throw the error to be handled by global exception filter
  //   }
  // }
}
