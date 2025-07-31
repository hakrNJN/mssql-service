import { Request, Response } from 'express';
import { HttpException } from '../exceptions/httpException';
interface ApiResponseOptions<T> {
    res: Response;
    req: Request;
    statusCode?: number;
    message?: string;
    data?: T;
    metadata?: Record<string, any>;
}
export declare class ApiResponse {
    static success<T>(options: ApiResponseOptions<T>): Response<any, Record<string, any>>;
    static error(error: HttpException, res: Response): Response<any, Record<string, any>>;
}
export {};
