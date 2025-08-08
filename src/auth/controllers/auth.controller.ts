import { Controller, Post, Body, Get, UseGuards, Request, Res, HttpStatus, HttpCode, Param } from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import { CreateAuthDto } from "../dto/create-auth.dto";
import { LoginDto } from "../dto/login.dto";
import { JwtCookieGuard } from "../guards/jwt-cookie.guard";
import { Response } from 'express';
import { RolesGuard } from "../../common/guards/role.guard";
import { Roles } from "../../app_user/decorators/roles.decorator";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    @HttpCode(HttpStatus.CREATED) // 201 - Resource created successfully
    async register(@Body() createAuthDto: CreateAuthDto, @Res({ passthrough: true }) res: Response) {
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
    }

    @Post('login')
    async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
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
    }


    @UseGuards(JwtCookieGuard ,  RolesGuard)
    @Get(':id')
    @Roles('SUPER_ADMIN') // Example role, adjust as needed
    async getProfileCookie(@Request() req , @Param('id') id: string , @Res({passthrough:true}) res: Response) {
        console.log("----------->",id)
        console.log("+++++++++++",req.user);
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
}