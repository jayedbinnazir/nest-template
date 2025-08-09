import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { JwtCookieGuard } from 'src/auth/guards/jwt-cookie.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

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
  async findOne( @Req() req) {
    try {
      const userId = req.user['id']; // Assuming user ID is stored in the request object
      console.log('Finding user with ID:', userId);
      return await this.userService.findOne(userId);
    } catch (error) {
      console.error('Error in findOne:', error);
      throw error; // Re-throw the error to be handled by global exception filter
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
