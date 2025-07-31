"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpException = exports.HttpStatus = void 0;
const STATUS_DESCRIPTIONS = {};
// Decorator to add descriptions to status codes
function Description(description) {
    return function (target, key) {
        const statusCode = target[key];
        STATUS_DESCRIPTIONS[statusCode] = description;
    };
}
// HTTP Status Map (as a class with static properties)
class HttpStatus {
}
exports.HttpStatus = HttpStatus;
HttpStatus.OK = 200;
HttpStatus.CREATED = 201;
HttpStatus.NO_CONTENT = 204;
HttpStatus.MOVED_PERMANENTLY = 301;
HttpStatus.BAD_REQUEST = 400;
HttpStatus.UNAUTHORIZED = 401;
HttpStatus.FORBIDDEN = 403;
HttpStatus.NOT_FOUND = 404;
HttpStatus.METHOD_NOT_ALLOWED = 405;
HttpStatus.EXPIRED = 410;
HttpStatus.UNSUPPORTED_MEDIA_TYPE = 415;
HttpStatus.TOO_MANY_REQUEST = 429;
HttpStatus.INTERNAL_SERVER_ERROR = 500;
HttpStatus.NOT_IMPLEMENTED = 501;
HttpStatus.SERVICE_UNAVAILABLE = 503;
__decorate([
    Description('OK - The request succeeded'),
    __metadata("design:type", Object)
], HttpStatus, "OK", void 0);
__decorate([
    Description('Created - The request succeeded, and a new resource was created as a result'),
    __metadata("design:type", Object)
], HttpStatus, "CREATED", void 0);
__decorate([
    Description('No Content - There is no content to send for this request, but the headers are useful'),
    __metadata("design:type", Object)
], HttpStatus, "NO_CONTENT", void 0);
__decorate([
    Description('Moved Permanently - The URL of the requested resource has been changed permanently. The new URL is given in the response.'),
    __metadata("design:type", Object)
], HttpStatus, "MOVED_PERMANENTLY", void 0);
__decorate([
    Description('Bad Request - The server cannot or will not process the request due to something that is perceived to be a client error'),
    __metadata("design:type", Object)
], HttpStatus, "BAD_REQUEST", void 0);
__decorate([
    Description('Unauthorized - Although the HTTP standard specifies "unauthorized", semantically this response means "unauthenticated". That is, the client must authenticate itself to get the requested response'),
    __metadata("design:type", Object)
], HttpStatus, "UNAUTHORIZED", void 0);
__decorate([
    Description('Forbidden - The client does not have access rights to the content; that is, it is unauthorized, so the server is refusing to give the requested resource'),
    __metadata("design:type", Object)
], HttpStatus, "FORBIDDEN", void 0);
__decorate([
    Description('Not Found - The server cannot find the requested resource'),
    __metadata("design:type", Object)
], HttpStatus, "NOT_FOUND", void 0);
__decorate([
    Description('Method Not Allowed - The request method is known by the server but is not supported by the target resource'),
    __metadata("design:type", Object)
], HttpStatus, "METHOD_NOT_ALLOWED", void 0);
__decorate([
    Description('Expired - This response is sent when the requested content has been permanently deleted from server'),
    __metadata("design:type", Object)
], HttpStatus, "EXPIRED", void 0);
__decorate([
    Description('Unsupported Media Type - The media format of the requested data is not supported by the server, so the server is rejecting the request'),
    __metadata("design:type", Object)
], HttpStatus, "UNSUPPORTED_MEDIA_TYPE", void 0);
__decorate([
    Description('Too Many Requests - The user has sent too many requests in a given amount of time'),
    __metadata("design:type", Object)
], HttpStatus, "TOO_MANY_REQUEST", void 0);
__decorate([
    Description('Internal Server Error - The server has encountered a situation it does not know how to handle'),
    __metadata("design:type", Object)
], HttpStatus, "INTERNAL_SERVER_ERROR", void 0);
__decorate([
    Description('Not Implemented - The request method is not supported by the server and cannot be handled'),
    __metadata("design:type", Object)
], HttpStatus, "NOT_IMPLEMENTED", void 0);
__decorate([
    Description('Service Unavailable - The server is not ready to handle the request. Common causes are a server that is down for maintenance or that is overloaded'),
    __metadata("design:type", Object)
], HttpStatus, "SERVICE_UNAVAILABLE", void 0);
class HttpException extends Error {
    constructor(status, message, details) {
        super(message);
        this.status = status;
        this.message = message;
        this.details = details;
    }
    get description() {
        return STATUS_DESCRIPTIONS[this.status] || 'Unknown Status';
    }
    // ----------------------------
    // 3. Predefined Factory Methods
    // ----------------------------
    static NotFound(message = 'Resource not found', details) {
        return new HttpException(HttpStatus.NOT_FOUND, message, details);
    }
    static InternalServerError(message = 'Internal server error', details) {
        return new HttpException(HttpStatus.INTERNAL_SERVER_ERROR, message, details);
    }
    static BadRequest(message = 'Invalid request', details) {
        return new HttpException(HttpStatus.BAD_REQUEST, message, details);
    }
    static TooManyRequest(message = 'Too Many Request in a Short Period', details) {
        return new HttpException(HttpStatus.TOO_MANY_REQUEST, message, details);
    }
    static UnAuthorised(message = 'You are not authorised', details) {
        return new HttpException(HttpStatus.UNAUTHORIZED, message, details);
    }
    static Expired(message = 'Code has expired', details) {
        return new HttpException(HttpStatus.EXPIRED, message, details);
    }
    static NotImplemented(message = 'This feature is not implemented', details) {
        return new HttpException(HttpStatus.NOT_IMPLEMENTED, message, details);
    }
}
exports.HttpException = HttpException;
