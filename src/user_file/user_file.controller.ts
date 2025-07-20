import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserFileService } from './user_file.service';
import { CreateUserFileDto } from './dto/create-user_file.dto';
import { UpdateUserFileDto } from './dto/update-user_file.dto';

@Controller('user-file')
export class UserFileController {
  constructor(private readonly userFileService: UserFileService) {}

  @Post()
  create(@Body() createUserFileDto: CreateUserFileDto) {
    return this.userFileService.create(createUserFileDto);
  }

  @Get()
  findAll() {
    return this.userFileService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userFileService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserFileDto: UpdateUserFileDto) {
    return this.userFileService.update(+id, updateUserFileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userFileService.remove(+id);
  }
}
