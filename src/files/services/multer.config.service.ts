import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MulterModuleOptions, MulterOptionsFactory } from "@nestjs/platform-express";
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';


@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  constructor(private readonly configService: ConfigService) {
    console.log("MulterConfigService initialized with config:", this.configService.get('files'));
  }

  createMulterOptions(): MulterModuleOptions {
    return {
      storage: diskStorage({
        destination: async (req, file, cb) => {
          console.log("destination called----------->");
         const uploadPath = await this.createUploadPath(file); 
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          // Generate unique filename with timestamp
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const ext = path.extname(file.originalname);
          const baseName = file.originalname.replace(ext, '').replace(/[^a-zA-Z0-9]/g, '_');
          cb(null, `${baseName}-${uniqueSuffix}${ext}`);
        },
      }),
      limits: {
        fileSize: this.configService.get<number>('files.maxFileSize') || 1024 * 1024 * 1024, // 1GB default
        files: this.configService.get<number>('files.maxFiles') || 10, // 10 files default
      },
      fileFilter: (req, file, cb) => {
        // Get allowed file types from configuration
        const allowedTypes = this.configService.get<string>('files.allowedFileTypes') || 'jpg,jpeg,png,gif,pdf,doc,docx';
        const allowedExtensions = allowedTypes.split(',').map(ext => ext.trim().toLowerCase());
        
        const fileExt = path.extname(file.originalname).toLowerCase().substring(1);
        
        if (allowedExtensions.includes(fileExt)) {
          cb(null, true);
        } else {
          cb(new Error(`File type not allowed. Allowed types: ${allowedTypes}`), false);
        }
      },
    };
  }

  public async createUploadPath(file:Express.Multer.File): Promise<string> {
    const dirType = file.fieldname;
        const fileType = file.mimetype.split("/")[0] 
        const uploadPath = path.join(process.cwd() , "public/uploads", dirType, fileType);
     try {
        await fs.promises.access(uploadPath)
        console.log(`Directory ${uploadPath} exists.`);
        return uploadPath;

     } catch (error){
        if (error.code === 'ENOENT') {
            console.log(`Directory ${uploadPath} does not exist. Creating...`);
            await fs.promises.mkdir(uploadPath, { recursive: true });
            console.log(`Directory ${uploadPath} created successfully.`);
            return uploadPath;
        }


        console.error(`Error creating upload path: ${error.message}`);
        throw new Error(`Failed to create upload path: ${error.message}`);
     }
  }

  public async removeFile(filePath: string): Promise<void> {
    try {
      await fs.promises.unlink(filePath);
      console.log(`File ${filePath} deleted successfully.`);
    } catch (error) {
      console.error(`Error deleting file ${filePath}: ${error.message}`);
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }
    
}
