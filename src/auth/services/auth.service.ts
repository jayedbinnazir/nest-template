import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Role } from "../../role/entities/role.entity";
import { User } from "../../user/entities/user.entity";
import { UserService } from "../../user/services/user.service";
import { RoleService } from "../../role/services/role.service";
import { AppUser } from "../../app_user/entities/app_user.entity";
import { AppUserService } from "../../app_user/services/app_user.service";
import { AuthUtils, PayLoad } from "../utils/auth";
import { CreateAuthDto } from "../dto/create-auth.dto";
import { LoginDto } from "../dto/login.dto";
import { DataSource } from "typeorm";
import { FilesService } from "../../files/services/files.service";


@Injectable()
export class AuthService {

    constructor(
        private readonly dataSource:DataSource,
        private readonly userService:UserService,
        private readonly roleService:RoleService,
        private readonly appUserService:AppUserService,
        //utils
        private readonly authUtils:AuthUtils,
        private readonly fileService: FilesService

    ) {}

    async registerUser(data:CreateAuthDto ,  file?: Express.Multer.File) {

        const queryRunner  =  this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            
            if(data.password !== data.confirmPassword) {
                throw new Error('Passwords do not match');
            }

            const hashedPassword = await AuthUtils.hashPassword(data.password);
            const user = await this.userService.createUser({
                ...data,
                password: hashedPassword,
            } , queryRunner.manager);

            if (!user) {
                throw new Error('User creation failed');
            }

            console.log('User created:', user);
            const role =  await this.roleService.findByName("CUSTOMER");
            if (!role) {
                throw new Error('Role not found');
            }

            // File upload is optional during registration
            const newFile = file ? await this.fileService.saveFileRecord(file, user.id, queryRunner.manager) : null;


            const appUser = await this.appUserService.createAppUser({
                user_id:user.id,
                role_id:role.id,
            },
            queryRunner.manager);

            if(!appUser) {
                throw new Error('App user creation failed');
            }
            await queryRunner.commitTransaction();

            // Get all AppUser records for this user (to support multiple roles)
            const appUserData = await this.appUserService.findAllByUserId(user.id); // Use user.id, not appUser.id
            if (appUserData.length === 0) {
                throw new Error('App user not found after creation');
            }
            
            // Extract all roles for this user
            const roles: string[] = [];
            for (const appUserRecord of appUserData) {
                const roleEntity = await appUserRecord.role; // Each appUserRecord has one role
                if (roleEntity) {
                    roles.push(roleEntity.name);
                }
            }
            
            const payload: PayLoad = {
                userId: user.id, // Use the actual user ID
                email: user.email, // Get email directly from user
                roles: roles, // Array of all role names
            }
            // Generate JWT token for the new user
            const token = await this.authUtils.generateToken(payload);

            // Return user data and token
            return {
                success: true,
                message: 'User registered successfully',
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    address: user.address,
                    created_at: user.created_at,
                    updated_at: user.updated_at,
                },
                access_token: token,
            };



        }catch (error) {
            await queryRunner.rollbackTransaction();
            throw new Error(`Error during registration: ${error.message}`);
        }
        finally {
            await queryRunner.release();
        }
    }

    async login(loginDto: LoginDto) {
        try {
            // Find user by email
            const user = await this.userService.findByEmail(loginDto.email);
            if (!user) {
                throw new Error('Invalid credentials');
            }

            // Verify password
            const isPasswordValid = await AuthUtils.comparePassword(loginDto.password, user.password);
            if (!isPasswordValid) {
                throw new Error('Invalid credentials');
            }

            // Find all app users for this user to get all roles
            const allAppUsers = await this.appUserService.findAllByUserId(user.id);
            if (!allAppUsers || allAppUsers.length === 0) {
                throw new Error('App user not found');
            }

            // Extract all roles for this user
            const roles: string[] = [];
            for (const appUserRecord of allAppUsers) {
                const roleEntity = await appUserRecord.role;
                if (roleEntity) {
                    roles.push(roleEntity.name);
                }
            }

            const payload: PayLoad = {
                userId: user.id, // Use the actual user ID
                email: user.email, // Get email directly from user
                roles: roles, // Array of all role names
            }

            // Generate JWT token
            const token = await this.authUtils.generateToken(payload);

            // Return user data and token
            return {
                success: true,
                message: 'Login successful',
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    address: user.address,
                    created_at: user.created_at,
                    updated_at: user.updated_at,
                },
                access_token: token,
                
            };
        } catch (error) {
            throw new Error(`Login failed: ${error.message}`);
        }
    }

}