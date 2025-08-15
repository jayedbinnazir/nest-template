import { ArrayMaxSize, IsArray, IsOptional } from 'class-validator';
import { CreateUserDto } from '../../user/dto/create-user.dto';




export class CreateAuthDto extends CreateUserDto {
    @IsArray()
    @ArrayMaxSize(1, { message: 'You can upload a maximum of 1 files' })
    @IsOptional()
    file: Express.Multer.File 
}