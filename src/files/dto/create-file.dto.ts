import { Transform } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { User } from "../../user/entities/user.entity";

export class CreateFileDto {


    @IsString()
    @IsNotEmpty({ message: 'Field name is required' })
    fieldname: string; // Original name of the file as uploaded by the user


    @IsString()
    @IsNotEmpty({ message: 'Original name is required' })
    originalname: string;  //given name of the file after upload


    @IsString()
    @IsNotEmpty({ message: 'Encoding is required' })
    encoding: string; // Path where the file is stored on the server

    @IsString()
    @IsNotEmpty({message: 'MIME type is required'})
    mimetype: string; // MIME type of the file

    @IsOptional()
    buffer?: Buffer; // Buffer containing the file data

    @IsNotEmpty({message: 'Size is required'})
    @IsNumber({ allowNaN: false, allowInfinity: false })
    size: number;  // Size of the file in bytes

    @IsNotEmpty({message: 'Description is required'})
    @IsBoolean()
    isActive: boolean;

    @IsString()
    @IsNotEmpty({message: 'Local URL is required'})
    local_url: string; // Local path for the file storage

    // URL path for serving the file
    @IsOptional()
    @IsString()
    @Transform(({ value }) => (value === null) || (value === "") ? undefined : String(value))
    public_url?: string | null = null;


}
