import { Transform } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCategoryDto {

    @IsNotEmpty({ message: 'Name is required' })
    @IsString()
    name: string;

    @Transform(({ value }) => {
        if (value === "" || value === undefined || value === null) {
            return null;
        }
        return String(value);
    })
    @IsOptional()
    @IsString({ message: 'flavour must be a string value' })
    description?: string | null; // Optional description for the category
}
