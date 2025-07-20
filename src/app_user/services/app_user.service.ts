import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AppUser } from "../entities/app_user.entity";
import { CreateAppUserDto } from "../dto/create-app_user.dto";
import * as bcrypt from "bcrypt";
import { instanceToPlain } from "class-transformer";
import { UpdateAppUserDto } from "../dto/update-app_user.dto";
import { UserFileService } from "../../user_file/user_file.service";
import { FileUploadService } from "src/file-upload/services/file-upload.service";

@Injectable()
export class AppUserService {
    constructor(
        @InjectRepository(AppUser)
        private readonly appUserRepository: Repository<AppUser>,
        private readonly userFileService: UserFileService,
        private readonly fileUploadService:FileUploadService
    ) {}


    async create(createAppUserDto: CreateAppUserDto) {
        try {
            const {name , email , password , phone , address} = createAppUserDto
            if(await this.appUserRepository.findOne({where: {email}})){
                throw new BadRequestException("Email already exists");
            }
            if(await this.appUserRepository.findOne({where: {phone}})){
                throw new BadRequestException("Phone already exists");
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = this.appUserRepository.create({name , email , password: hashedPassword , phone , address})
            const savedUser = await this.appUserRepository.save(user)
            return instanceToPlain(savedUser);
        }catch(error){
            throw new BadRequestException(error.message);
        }
    }


    async findAll(withDeleted: boolean = false) {
        try {
            const users = await this.appUserRepository.find({withDeleted: withDeleted});
            return users.map(user=>instanceToPlain(user));
        }catch(error){
            throw new BadRequestException(error.message);
        }
    }


    async findOneById(user_id: string , withDeleted: boolean = false) {
        try {
            const user = await this.appUserRepository.findOne({where: {id:user_id} , withDeleted: withDeleted});
            return instanceToPlain(user);
        }catch(error){
            throw new BadRequestException(error.message);
        }
    }


    async findOneByEmail(email: string , withDeleted: boolean = false) {
        try {
            const user = await this.appUserRepository.findOne({where: {email} , withDeleted: withDeleted});
            return instanceToPlain(user);
        }catch(error){
            throw new BadRequestException(error.message);
        }
    }

    async findOneByPhone(phone: string , withDeleted: boolean = false) {
        try {
            const user = await this.appUserRepository.findOne({where: {phone} , withDeleted: withDeleted});
            return instanceToPlain(user);
        }catch(error){
            throw new BadRequestException(error.message);
        }
    }

    async updateById(user_id: string , updateAppUserDto: UpdateAppUserDto) {
        try {
            const user = await this.findOneById(user_id);
            if(!user){
                throw new BadRequestException("User not found");
            }

            const {name , email , password , phone , address} = updateAppUserDto
            const passwordToUpdate = password ? await bcrypt.hash(password , 10) : user.password
            const updateData = {
                ...updateAppUserDto,
                password: passwordToUpdate
            }
            const updatedUser = await this.appUserRepository.update(user_id , updateData);
            return instanceToPlain(updatedUser);
        }catch(error){
            throw new BadRequestException(error.message);
        }
    }


    async softDeleteById(user_id: string) {
        try {
            const user = await this.findOneById(user_id);
            if(!user){
                throw new BadRequestException("User not found");
            }
             await this.appUserRepository.softDelete(user_id);
            return {
                message: "User deleted successfully",
                user_id: user_id
            }
        }catch(error){
            throw new BadRequestException(error.message);
        }
    }


    async hardDeleteById(user_id: string) {
        try {
            const user = await this.findOneById(user_id , true);
            if(!user){
                throw new BadRequestException("User not found");
            }
            await this.appUserRepository.delete(user_id);
            return {
                message: "User deleted successfully",
                user_id: user_id
            }
        }catch(error){
            throw new BadRequestException(error.message);
        }
    }


    async restoreById(user_id: string) {
        try {
            const user = await this.findOneById(user_id , true);
            if(!user){
                throw new BadRequestException("User not found");
            }
            await this.appUserRepository.restore(user_id);
            return {
                message: "User restored successfully",
                user_id: user.id,
            }
        }catch(error){
            throw new BadRequestException(error.message);
        }
    }

}