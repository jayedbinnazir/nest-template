import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AppUser } from "../entities/app_user.entity";
import { CreateAppUserDto } from "../dto/create-app_user.dto";
import * as bcrypt from "bcrypt";
import { instanceToPlain } from "class-transformer";
import { UpdateAppUserDto } from "../dto/update-app_user.dto";
import { DataSource } from 'typeorm';
import { CreateUserFileDto } from '../../user_file/dto/create-user_file.dto';
import { CreateFileUploadDto } from '../../file-upload/dto/create-file-upload.dto';
import { FileUtils } from '../../file-upload/utils/file-utils';
import { FileUpload } from '../../file-upload/entities/file-upload.entity';

@Injectable()
export class AppUserService {
    constructor(
        @InjectRepository(AppUser)
        private readonly appUserRepository: Repository<AppUser>,
        private readonly dataSource: DataSource,
    ) {}

    private async createUserWithRepo(repo: Repository<AppUser>, createAppUserDto: CreateAppUserDto): Promise<AppUser> {
        const { name, email, password, phone, address } = createAppUserDto;
        if (await repo.findOne({ where: { email } })) {
            throw new BadRequestException('Email already exists');
        }
        if (phone && await repo.findOne({ where: { phone } })) {
            throw new BadRequestException('Phone already exists');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = repo.create({ name, email, password: hashedPassword, phone, address });
        return await repo.save(user);
        
    }

    async create(createAppUserDto: CreateAppUserDto) {
        try {
            const savedUser = await this.createUserWithRepo(this.appUserRepository, createAppUserDto);
            return instanceToPlain(savedUser);
        } catch (error) {
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


    async createWithProfilePicture(createAppUserDto: CreateAppUserDto, profilePicture: Express.Multer.File) {
        console.log("profilePicture in service", profilePicture)
        return await this.dataSource.transaction(async manager => {
            // 1. Create user using manager's repo
            const savedUser = await this.createUserWithRepo(manager.getRepository(AppUser), createAppUserDto);

            // 2. Create file (profile picture)
            let fileUpload: FileUpload | null = null;
            if (profilePicture) {
                const fileDto: CreateFileUploadDto = {
                    originalName: profilePicture.originalname,
                    filename: profilePicture.filename || "default.png",
                    path: profilePicture.path || "default.png",
                    mimetype: profilePicture.mimetype,
                    size: profilePicture.size,
                    extension: FileUtils.getFileExtension(profilePicture.originalname),
                    fileType: FileUtils.getFileType(profilePicture.mimetype),
                    isPublic: false,
                };

                console.log("fileDto in service", fileDto)
                const fileEntity = manager.getRepository(FileUpload).create(fileDto);
                fileUpload = await manager.getRepository(FileUpload).save(fileEntity);

                // 3. Create user_file association
                const userFileDto: CreateUserFileDto = {
                    user_id: savedUser.id,
                    file_id: fileUpload.id,
                    role: 'owner',
                    isFavorite: false,
                };
                const userFileEntity = manager.getRepository('user_file').create(userFileDto);
                await manager.getRepository('user_file').save(userFileEntity);
            }

            // Return user and file info
            return {
                message: 'User and profile picture created successfully',
                user: instanceToPlain(savedUser),
                profilePicture: fileUpload ? instanceToPlain(fileUpload) : null,
            };
        });
    }


}