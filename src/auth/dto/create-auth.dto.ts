import { ArrayMaxSize, IsArray, IsOptional, IsString } from 'class-validator';
import { CreateUserDto } from '../../user/dto/create-user.dto';



//i only allow single file upload for profile picture
export class CreateAuthDto extends CreateUserDto {
    @IsArray()
    @ArrayMaxSize(1, { message: 'You can upload a maximum of 1 files' })
    @IsOptional()
    profile_picture?: Express.Multer.File | null; // Optional file upload field, can be null if no file is uploaded

    @IsOptional()
    @IsString()
    session_id?:string|null
}