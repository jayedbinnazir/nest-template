import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class FileUploadExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    } else if (exception instanceof Error) {
      // Handle Multer errors
      if (exception.message.includes('File too large')) {
        status = HttpStatus.PAYLOAD_TOO_LARGE;
        message = 'File size exceeds the maximum allowed limit';
      } else if (exception.message.includes('File type not allowed')) {
        status = HttpStatus.BAD_REQUEST;
        message = exception.message;
      } else if (exception.message.includes('Unexpected field')) {
        status = HttpStatus.BAD_REQUEST;
        message = 'Invalid file field name';
      } else if (exception.message.includes('No file uploaded')) {
        status = HttpStatus.BAD_REQUEST;
        message = 'No file was uploaded';
      } else {
        message = exception.message;
      }
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
      error: exception instanceof Error ? exception.name : 'Unknown Error',
    });
  }
} 