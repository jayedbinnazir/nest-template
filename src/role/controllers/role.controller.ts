import { Body, Controller, Post } from "@nestjs/common";
import { RoleService } from "../services/role.service";
import { Role } from "../entities/role.entity";
import { CreateRoleDto } from "../dto/create-role.dto";

@Controller('role')
export class RoleController {
    constructor(private readonly roleService: RoleService) {}

    @Post('create')
    async createRole(@Body() data: CreateRoleDto): Promise<Role> {
        return this.roleService.createRole(data);
    }
}