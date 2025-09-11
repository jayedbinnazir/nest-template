import { IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

export class CreateRatingDto {

    @IsString()
    product_id: string;

    @IsOptional()
    @IsString()
    user_id?: string | null;

    @IsOptional()
    @IsString()
    session_id?: string | null;

    @IsNumber({ maxDecimalPlaces: 1 }) // only allow 1 decimal place
    @Min(1)
    @Max(5)
    rating: number; // e.g. 4.5 or 3.0
}
