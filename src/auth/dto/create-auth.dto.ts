import { IsOptional } from 'class-validator';
import { CreateUserDto } from '../../user/dto/create-user.dto';




export class CreateAuthDto extends CreateUserDto {
    @IsOptional()
    file?: Express.Multer.File | null; // Optional file upload for profile picture
}