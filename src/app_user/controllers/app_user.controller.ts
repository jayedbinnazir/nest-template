import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFile, UseInterceptors } from "@nestjs/common";
import { AppUserService } from "../services/app_user.service";
import { CreateAppUserDto } from "../dto/create-app_user.dto";
import { UpdateAppUserDto } from "../dto/update-app_user.dto";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller('app-user')
export class AppUserController {
    constructor(private readonly appUserService: AppUserService) {}

    @UseInterceptors(FileInterceptor("profile_picture"))
    @Post("create")
    async create(@UploadedFile() profile_picture:Express.Multer.File ,@Body() createAppUserDto: CreateAppUserDto) {

        console.log("profile-picture", profile_picture)
       try {
        const user = await this.appUserService.create(createAppUserDto);
        return {
            message: "User created successfully",
            user
        }
       } catch (error) {    
        throw new BadRequestException(error.message);
       }
    }


    @Get("all")
    async findAll(@Query("withDeleted") withDeleted: boolean) {
        try {
            const users = await this.appUserService.findAll(withDeleted);
            return users;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }


    @Get(":user_id/:withDeleted")
    async findOneById(@Param("user_id") user_id: string , @Param("withDeleted") withDeleted: boolean) {
        try {
            const user = await this.appUserService.findOneById(user_id , withDeleted);
            return user;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }


    @Put(":user_id")
    async updateById(@Param("user_id") user_id: string , @Body() updateAppUserDto: UpdateAppUserDto) {
        try {
            const user = await this.appUserService.updateById(user_id , updateAppUserDto);
            return {
                message: "User updated successfully",
                user: user
            };
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    @Delete(":user_id")
    async softDeleteById(@Param("user_id") user_id: string) {
        try {
            const response = await this.appUserService.softDeleteById(user_id);
            return response;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }


    @Delete(":user_id")
    async hardDeleteById(@Param("user_id") user_id: string) {
        try {
            const response = await this.appUserService.hardDeleteById(user_id);
            return response;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    @Put("/restore/:user_id")
    async restoreById(@Param("user_id") user_id: string) {
        try {
            const response = await this.appUserService.restoreById(user_id);
            return response;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}