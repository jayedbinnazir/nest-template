import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AppUser } from 'src/app_user/entities/app_user.entity';
import { JwtPayload } from 'jsonwebtoken';

export interface PayLoad extends JwtPayload {
    userId:string;
    email:string;
    roles: string[];
}

@Injectable()
export class AuthUtils {

    constructor(private readonly jwtService: JwtService) {}

    async generateToken(user:PayLoad): Promise<string> {
        const payload = user;
        return this.jwtService.signAsync(payload);
    }

    static async hashPassword(password:string):Promise<string> {
        return await bcrypt.hash(password,10);
    }

    static async comparePassword(password:string, hashedPassword:string):Promise<boolean> { 
        return await bcrypt.compare(password, hashedPassword);
    }

}