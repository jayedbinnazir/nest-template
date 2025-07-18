import { Controller } from "@nestjs/common";
import { AppUserService } from "../services/app_user.service";

@Controller('app-user')
export class AppUserController {
    constructor(private readonly appUserService: AppUserService) {}

    
}