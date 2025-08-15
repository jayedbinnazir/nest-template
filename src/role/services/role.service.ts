import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Role } from "../entities/role.entity";
import { Repository } from "typeorm";
import { CreateRoleDto } from "../dto/create-role.dto";

@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
    ) {}

    async createRole(data: CreateRoleDto): Promise<Role> {
        try {
            if (data.name && await this.roleRepository.findOne({ where: { name: data.name } })) {
                throw new Error(`Role with name ${data.name} already exists`);
            }
            const role = this.roleRepository.create(data);
            return await this.roleRepository.save(role);
        } catch (error) {
            throw new Error(`Error creating role: ${error.message}`);
        }
    }

    async findByName(name:string): Promise<Role | null> {
        try {
            return await this.roleRepository.findOne({ where: { name } });
        } catch (error) {
            throw new Error(`Error finding role by name: ${error.message}`);
        }

    }

}