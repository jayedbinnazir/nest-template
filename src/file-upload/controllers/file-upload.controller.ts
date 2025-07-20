import {
  Controller,

 

  UseGuards,
} from '@nestjs/common';

import { FileUploadService } from '../services/file-upload.service';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../app_user/guard/user.guard';

@Controller('file-upload')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

 


}
