import { Controller } from "@nestjs/common";
import { FileUploadService } from "../services/file-upload.service";

@Controller('file-upload')
export class FileUploadController {
    constructor(private readonly fileUploadService: FileUploadService) {}
}