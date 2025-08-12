import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile, HttpCode, Req } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { JwtCookieGuard } from 'src/auth/guards/jwt-cookie.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @UseGuards(JwtCookieGuard)
  @Get('me')
  async findOne(@Req() req) {
    try {
      const userId = req.user['id']; // Assuming user ID is stored in the request object
      console.log('Finding user with ID:', userId);
      return await this.userService.findOne(userId);
    } catch (error) {
      console.error('Error in findOne:', error);
      throw error; // Re-throw the error to be handled by global exception filter
    }
  }

  @UseGuards(JwtCookieGuard)
  @Patch("update")
  @HttpCode(200) // 200 OK
  @UseInterceptors(FileInterceptor('profile_pic')) // Assuming you want to handle file uploads
  async update(@Req() request, @Body() updateUserDto: UpdateUserDto, @UploadedFile() file: Express.Multer.File) {
    const userId = request.user['id']; // Assuming user ID is stored in the request object
    try {
      updateUserDto.profile_picture = file; // Attach the file to the DTO
      await this.userService.update(userId, updateUserDto);

      return {
        message: 'User updated successfully',
        user: await this.userService.findOne(userId), // Return the updated user
      };
    } catch (error) {
      console.error('Error in update:', error);
      throw error; // Re-throw the error to be handled by global exception filter
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
