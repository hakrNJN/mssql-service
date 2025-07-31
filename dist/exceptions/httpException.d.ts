export declare class HttpStatus {
    static OK: number;
    static CREATED: number;
    static NO_CONTENT: number;
    static MOVED_PERMANENTLY: number;
    static BAD_REQUEST: number;
    static UNAUTHORIZED: number;
    static FORBIDDEN: number;
    static NOT_FOUND: number;
    static METHOD_NOT_ALLOWED: number;
    static EXPIRED: number;
    static UNSUPPORTED_MEDIA_TYPE: number;
    static TOO_MANY_REQUEST: number;
    static INTERNAL_SERVER_ERROR: number;
    static NOT_IMPLEMENTED: number;
    static SERVICE_UNAVAILABLE: number;
}
export declare class HttpException extends Error {
    status: number;
    message: string;
    details?: any;
    constructor(status: number, message: string, details?: any);
    get description(): string;
    static NotFound(message?: string, details?: any): HttpException;
    static InternalServerError(message?: string, details?: any): HttpException;
    static BadRequest(message?: string, details?: any): HttpException;
    static TooManyRequest(message?: string, details?: any): HttpException;
    static UnAuthorised(message?: string, details?: any): HttpException;
    static Expired(message?: string, details?: any): HttpException;
    static NotImplemented(message?: string, details?: any): HttpException;
}
