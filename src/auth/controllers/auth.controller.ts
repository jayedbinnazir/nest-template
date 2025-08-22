import { Controller, Post, Body, Get, UseGuards, Res, HttpStatus, HttpCode, Param, Req, UseInterceptors, UploadedFile } from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import { CreateAuthDto } from "../dto/create-auth.dto";
import { LoginDto } from "../dto/login.dto";
import { JwtCookieGuard } from "../guards/jwt-cookie.guard";
import { Request, Response } from 'express';
import { RolesGuard } from "../../common/guards/role.guard";
import { Roles } from "../../app_user/decorators/roles.decorator";
import * as fs from 'fs';
import * as path from "path";
import { FileInterceptor } from "@nestjs/platform-express";
import { GoogleAuthGuard } from "../guards/google-auth.guard";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    @HttpCode(HttpStatus.CREATED) // 201 - Resource created successfully
    @UseInterceptors(FileInterceptor('profile_pic')) // Assuming you want to handle file uploads
    async register(@Body() createAuthDto: CreateAuthDto, @Res({ passthrough: true }) res: Response, @UploadedFile() file: Express.Multer.File) {
        if (file) {
            console.log("file in auth controller", file);
            createAuthDto.file = file; // Assign the uploaded file to the DTO
        }

        console.log("createAuthDto in controller=========>", createAuthDto);
        try {
            const result = await this.authService.registerUser(createAuthDto);

            // Set cookie for cookie-based authentication
            res.cookie('access_token', result.access_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 24 * 60 * 60 * 1000, // 24 hours
                path: '/',
            });

            return result;
        } catch (error) {
            console.error('Error during registration:', error);
            throw error; // Re-throw the error to be handled by global exception filter
        }
    }

    @Post('login')
    async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
        try {

            const result = await this.authService.login(loginDto);

            // Set cookie for cookie-based authentication
            res.status(HttpStatus.OK); // Set status to 200 OK
            res.cookie('access_token', result.access_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 24 * 60 * 60 * 1000, // 24 hours
                path: '/',
            });

            return result;
        } catch (error) {
            console.error('Error during login:', error);
            throw error; // Re-throw the error to be handled by global exception filter
        }
    }


    @Post("google-login")
    @UseGuards(GoogleAuthGuard)
    async googleAuth(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        console.log("Google Auth called", req.user);

        if (!req.user) {
            console.error('Google authentication failed: No user data found');
            throw new Error('Google authentication failed: No user data found');
        }
        const createAuthDto: CreateAuthDto = {
            ...req.user as CreateAuthDto, // Assuming req.user contains the necessary user data
        };
         const result = await this.authService.googleLogin(createAuthDto);
        try {
        } catch (error) {
            console.error('Error during Google login:', error);
            throw error; // Re-throw the error to be handled by global exception filter
        }
      
    }


    // @UseGuards(JwtCookieGuard ,  RolesGuard)
    @Post(':id')
    @UseInterceptors(FileInterceptor('profile_pic')) // Assuming you want to handle file uploads
    // @Roles('SUPER_ADMIN') // Example role, adjust as needed
    async getProfileCookie(@Req() req: Request, @Param('id') id: string, @Res({ passthrough: true }) res: Response, @UploadedFile() file: Express.Multer.File) {
        console.log("file", file)
        const url = req.url;
        const body = req.body;
        console.log("Request body", Object.keys(body)[0]);
        const uploadDir = `/public/uploads/${Object.keys(body)[0]}`; // Define your upload directory here
        console.log("directry", path.join(process.cwd(), uploadDir)) // Example path for profile pictures
        await this.checkDirExistAndCreate(path.join(process.cwd(), uploadDir));
        console.log("Request URL:", url.split("/"));

        console.log("----------->", id)
        console.log("+++++++++++", req.user);
        res.end();
    }



    @UseGuards(JwtCookieGuard)
    @Post('logout')
    @HttpCode(HttpStatus.OK) // 200 - Successful logout
    async logout(@Res({ passthrough: true }) res: Response) {
        res.cookie('access_token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            expires: new Date(0),
        });

        return { message: 'Logged out successfully' };
    }


    private async checkDirExistAndCreate(dirPath: string): Promise<boolean> {
        try {

            await fs.promises.access(dirPath);
            console.log(`Directory ${dirPath} exists.`);
            return true;
        }

        catch (error) {
            if (error.code === 'ENOENT') {
                console.log(`Directory ${dirPath} does not exist. Creating...`);
                await fs.promises.mkdir(dirPath, { recursive: true });
                console.log(`Directory ${dirPath} created successfully.`);
                return true;
            }
            console.error(`Error checking directory existence: ${error.message}`);
            return false;
        }
    }
}