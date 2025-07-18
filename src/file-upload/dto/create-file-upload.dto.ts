import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateFileUploadDto {
    @IsNotEmpty()
    @IsString()
    @IsOptional()
    profile_picture: string;
}

