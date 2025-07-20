# File Upload Module

A comprehensive file upload system for NestJS applications with support for multiple file types, user authentication, and role-based access control.

## Features

- ✅ Single and multiple file uploads
- ✅ File type validation (images, documents, archives)
- ✅ File size limits and validation
- ✅ User-based file ownership
- ✅ Public/private file access control
- ✅ Soft delete functionality
- ✅ File download endpoints
- ✅ Search and filtering capabilities
- ✅ Pagination support
- ✅ Role-based access control
- ✅ Organized file storage (year/month structure)
- ✅ Custom exception handling

## File Structure

```
src/file-upload/
├── controllers/
│   └── file-upload.controller.ts
├── dto/
│   ├── create-file-upload.dto.ts
│   ├── update-file-upload.dto.ts
│   └── file-upload-response.dto.ts
├── entities/
│   └── file-upload.entity.ts
├── services/
│   └── file-upload.service.ts
├── filters/
│   └── file-upload-exception.filter.ts
├── interfaces/
│   └── file-upload.interface.ts
├── utils/
│   └── file-utils.ts
├── multer.config.ts
├── file-upload.module.ts
└── README.md
```

## Configuration

### Environment Variables

Add these to your `.env` file:

```env
FILE_MAX_SIZE=2147483648        # 2GB in bytes (for large video files)
FILE_UPLOAD_PATH=public/uploads # Upload directory (relative to project root)
FILE_ALLOWED_TYPES=image/jpeg,image/png,application/pdf,video/mp4,audio/mpeg # Comma-separated MIME types
```

### Supported File Types

- **Images**: JPEG, JPG, PNG, GIF, WebP, SVG
- **Documents**: PDF, Word, Excel, Text, CSV, HTML
- **Archives**: ZIP, RAR, 7Z
- **Videos**: MP4, MPEG, QuickTime, AVI, WMV, FLV, WebM, OGG, 3GPP
- **Audio**: MP3, WAV, OGG, AAC, FLAC, WebM, M4A, WMA

## API Endpoints

### Upload Files

#### Single File Upload
```http
POST /file-upload/upload
Content-Type: multipart/form-data

file: [file]
description: "Optional file description"
isPublic: false
```

#### Multiple Files Upload
```http
POST /file-upload/upload-multiple
Content-Type: multipart/form-data

files: [file1, file2, ...]
description: "Optional description for all files"
isPublic: false
```

### Get Files

#### Get All Files (with pagination and filters)
```http
GET /file-upload?page=1&limit=10&search=document&fileType=document&uploadedBy=user123
```

#### Get Public Files
```http
GET /file-upload/public?page=1&limit=10
```

#### Get My Files
```http
GET /file-upload/my-files
```

#### Get Files by Type
```http
GET /file-upload/type/video?page=1&limit=10
GET /file-upload/type/audio?page=1&limit=10
GET /file-upload/type/image?page=1&limit=10
```

#### Get Media Files (Video & Audio)
```http
GET /file-upload/media?page=1&limit=10&search=music
```

#### Get Single File
```http
GET /file-upload/:id
```

#### Download File
```http
GET /file-upload/:id/download
```

### Update File
```http
PATCH /file-upload/:id
Content-Type: application/json

{
  "description": "Updated description",
  "isPublic": true
}
```

### Delete Files

#### Delete File (Admin only)
```http
DELETE /file-upload/:id
```

#### Delete My File
```http
DELETE /file-upload/my-files/:id
```

## Usage Examples

### Frontend Integration

#### Upload Single File
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('description', 'My uploaded file');
formData.append('isPublic', 'false');

const response = await fetch('/file-upload/upload', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});
```

#### Upload Multiple Files
```javascript
const formData = new FormData();
Array.from(fileInput.files).forEach(file => {
  formData.append('files', file);
});
formData.append('description', 'Multiple files');

const response = await fetch('/file-upload/upload-multiple', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});
```

### Service Usage

```typescript
import { FileUploadService } from './file-upload.service';

@Injectable()
export class MyService {
  constructor(private fileUploadService: FileUploadService) {}

  async uploadUserAvatar(file: Express.Multer.File, userId: string) {
    return this.fileUploadService.create(file, {
      description: 'User avatar',
      isPublic: true
    }, userId);
  }
}
```

## Security Features

- **Authentication Required**: All endpoints require JWT authentication
- **Role-Based Access**: Admin role required for global file deletion
- **User Isolation**: Users can only delete their own files
- **File Type Validation**: Strict MIME type checking
- **File Size Limits**: Configurable maximum file size (100MB default, 2GB for videos)
- **Path Traversal Protection**: Sanitized file paths
- **Unique Filenames**: Prevents filename conflicts
- **Media File Support**: Enhanced support for video and audio files

## Error Handling

The module includes comprehensive error handling for:
- File size exceeded
- Invalid file types
- Missing files
- Database errors
- File system errors

## Database Schema

The `file_uploads` table includes:
- UUID primary key
- Original and generated filenames
- File path and metadata
- File type classification
- User ownership
- Public/private flag
- Timestamps (created, updated, deleted)

## File Storage

Files are stored in the project root under `public/uploads/` and organized in a year/month structure:

```
nest_auth/
├── public/
│   └── uploads/
│       ├── 2024/
│       │   ├── 01/
│       │   ├── 02/
│       │   └── ...
│       └── 2025/
│           ├── 01/
│           └── ...
├── src/
└── ...
```

**Key Points:**
- **Root-based path**: Files are stored relative to your project root
- **Automatic directory creation**: The module automatically creates the upload directory structure
- **Year/month organization**: Files are organized by upload date for better management
- **Public access**: Files in `public/uploads/` can be served statically by your web server

## Media File Support

### Video Files
- **Supported Formats**: MP4, MPEG, QuickTime, AVI, WMV, FLV, WebM, OGG, 3GPP
- **Max Size**: 2GB (configurable)
- **Use Cases**: Video uploads, presentations, tutorials

### Audio Files
- **Supported Formats**: MP3, WAV, OGG, AAC, FLAC, WebM, M4A, WMA
- **Max Size**: 500MB (configurable)
- **Use Cases**: Music uploads, podcasts, voice recordings

### Media File Endpoints
- `GET /file-upload/media` - Get all video and audio files
- `GET /file-upload/type/video` - Get only video files
- `GET /file-upload/type/audio` - Get only audio files

## Dependencies

- `@nestjs/platform-express`
- `@nestjs/typeorm`
- `multer`
- `class-validator`
- `class-transformer`

## Testing

Run the module tests:
```bash
npm run test src/file-upload
```

## Contributing

When adding new features:
1. Update the entity if needed
2. Add corresponding DTOs
3. Update service methods
4. Add controller endpoints
5. Update documentation
6. Add tests 