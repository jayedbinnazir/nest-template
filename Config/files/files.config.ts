export default () => ({
    // Base upload directory
    baseUploadPath: process.env.BASE_UPLOAD_PATH || './public/uploads',
    
    // File size limits (1GB = 1024 * 1024 * 1024 bytes)
    maxFileSize: process.env.MAX_FILE_SIZE ? parseInt(process.env.MAX_FILE_SIZE) : 1024 * 1024 * 1024, // 1GB
    maxFiles: process.env.MAX_FILES ? parseInt(process.env.MAX_FILES) : 10,
    
    // Allowed file types - more comprehensive
    allowedFileTypes: process.env.ALLOWED_FILE_TYPES || 'jpg,jpeg,png,gif,pdf,doc,docx,txt,mp4,mp3,zip,rar,xlsx,pptx',
    
    // Dynamic folder categories
    categories: {
        profile: 'profile',
        documents: 'documents', 
        images: 'images',
        videos: 'videos',
        audio: 'audio',
        attachments: 'attachments',
        temp: 'temp'
    },
    
    // File serving configuration
    serveStatic: {
        root: process.env.STATIC_FILES_ROOT || './public',
        prefix: process.env.STATIC_FILES_PREFIX || '/static'
    }
});
