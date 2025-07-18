import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus} from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
const path = require("path");
import { promises as fs } from "fs";

export interface ErrorData {
    statusCode: number;
    message: string;
    timestamp: string;
    path: string;
}

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
    constructor(private readonly httpAdapter: HttpAdapterHost) {}
    catch(exception: unknown, host: ArgumentsHost) {
        const contextType = host.getType();
        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let path = 'unknown';

        // Handle different transport types
        if (exception instanceof HttpException) {
            status = exception.getStatus();
            message = exception.message;
        }

        // Get context-specific information
        if (contextType === 'http') {
            const { httpAdapter } = this.httpAdapter;
            const ctx = host.switchToHttp();
            path = httpAdapter.getRequestUrl(ctx.getRequest());
            
            let body: ErrorData = {
                statusCode: status,
                message,
                timestamp: new Date().toISOString(),
                path,
            };
            
            // Log the error
            this.writeHttpLog(body);
            
            httpAdapter.reply(ctx.getResponse(), body, status);
        } 
        else if (contextType === 'ws') {
            // Handle WebSocket errors
            const ctx = host.switchToWs();
            const client = ctx.getClient();
            path = 'websocket';
            
            let body: ErrorData = {
                statusCode: status,
                message,
                timestamp: new Date().toISOString(),
                path,
            };
            
            // Log the error
            this.writeHttpLog(body);
            
            // Send error to WebSocket client
            client.emit('error', {
                statusCode: status,
                message,
                timestamp: new Date().toISOString(),
            });
        }
        else if (contextType === 'rpc') {
            // Handle RPC/microservice errors
            const ctx = host.switchToRpc();
            path = 'rpc';
            
            let body: ErrorData = {
                statusCode: status,
                message,
                timestamp: new Date().toISOString(),
                path,
            };
            
            // Log the error
            this.writeHttpLog(body);
            
            // Return error for RPC
            return {
                statusCode: status,
                message,
                timestamp: new Date().toISOString(),
            };
        }
    }


    private async writeHttpLog(body: ErrorData) {
        const LOG_DIR = path.join(process.cwd(), 'logs', `${Date.now()}-log.json`);

        try {
            // Ensure logs directory exists
            await fs.mkdir(path.dirname(LOG_DIR), { recursive: true });
            await fs.writeFile(LOG_DIR, JSON.stringify(body, null, 2));
        } catch (error) {
            console.error('Error writing log file:', error);
        }
    }
       
}