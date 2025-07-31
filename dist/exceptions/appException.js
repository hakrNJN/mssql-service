"use strict";
// src/exception/app.exception.ts
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
exports.AppError = exports.HttpStatus = void 0;
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
HttpStatus.ACCEPTED = 202;
HttpStatus.NON_AUTHORITATIVE = 203;
HttpStatus.NO_CONTENT = 204;
HttpStatus.RESET_CONTENT = 205;
HttpStatus.PARTIAL_CONTENT = 206;
HttpStatus.MULTIPLE_CHOICES = 300;
HttpStatus.MOVED_PERMANENTLY = 301;
HttpStatus.FOUND = 302;
HttpStatus.SEE_OTHER = 303;
HttpStatus.NOT_MODIFIED = 304;
HttpStatus.USE_PROXY = 305; // No longer recommended
HttpStatus.TEMPORARY_REDIRECT = 307;
HttpStatus.PERMANENT_REDIRECT = 308;
HttpStatus.BAD_REQUEST = 400;
HttpStatus.UNAUTHORIZED = 401;
HttpStatus.PAYMENT_REQUIRED = 402;
HttpStatus.FORBIDDEN = 403;
HttpStatus.NOT_FOUND = 404;
HttpStatus.METHOD_NOT_ALLOWED = 405;
HttpStatus.NOT_ACCEPTABLE = 406;
HttpStatus.PROXY_AUTHENTICATION_REQUIRED = 407;
HttpStatus.REQUEST_TIMEOUT = 408;
HttpStatus.CONFLICT = 409;
HttpStatus.GONE = 410; // Renamed from EXPIRED to GONE for standard HTTP term
HttpStatus.LENGTH_REQUIRED = 411;
HttpStatus.PRECONDITION_FAILED = 412;
HttpStatus.PAYLOAD_TOO_LARGE = 413;
HttpStatus.URI_TOO_LONG = 414;
HttpStatus.UNSUPPORTED_MEDIA_TYPE = 415;
HttpStatus.RANGE_NOT_SATISFIABLE = 416;
HttpStatus.EXPECTATION_FAILED = 417;
HttpStatus.IM_A_TEAPOT = 418; // HTTP Tea Pot joke
HttpStatus.MISDIRECTED_REQUEST = 421;
HttpStatus.UNPROCESSABLE_ENTITY = 422;
HttpStatus.LOCKED = 423;
HttpStatus.FAILED_DEPENDENCY = 424;
HttpStatus.TOO_EARLY = 425;
HttpStatus.UPGRADE_REQUIRED = 426;
HttpStatus.PRECONDITION_REQUIRED = 428;
HttpStatus.TOO_MANY_REQUEST = 429;
HttpStatus.REQUEST_HEADER_FIELDS_TOO_LARGE = 431;
HttpStatus.UNAVAILABLE_FOR_LEGAL_REASONS = 451;
HttpStatus.INTERNAL_SERVER_ERROR = 500;
HttpStatus.NOT_IMPLEMENTED = 501;
HttpStatus.BAD_GATEWAY = 502;
HttpStatus.SERVICE_UNAVAILABLE = 503;
HttpStatus.GATEWAY_TIMEOUT = 504;
HttpStatus.HTTP_VERSION_NOT_SUPPORTED = 505;
HttpStatus.VARIANT_ALSO_NEGOTIATES = 506;
HttpStatus.INSUFFICIENT_STORAGE = 507;
HttpStatus.LOOP_DETECTED = 508;
HttpStatus.NOT_EXTENDED = 510;
HttpStatus.NETWORK_AUTHENTICATION_REQUIRED = 511;
__decorate([
    Description('OK - The request succeeded'),
    __metadata("design:type", Object)
], HttpStatus, "OK", void 0);
__decorate([
    Description('Created - The request succeeded, and a new resource was created as a result'),
    __metadata("design:type", Object)
], HttpStatus, "CREATED", void 0);
__decorate([
    Description('Accepted - The request has been accepted for processing, but the processing has not been completed'),
    __metadata("design:type", Object)
], HttpStatus, "ACCEPTED", void 0);
__decorate([
    Description('Non-Authoritative Information - The server is a transforming proxy that received a 200 OK from its origin, but is returning a modified version'),
    __metadata("design:type", Object)
], HttpStatus, "NON_AUTHORITATIVE", void 0);
__decorate([
    Description('No Content - There is no content to send for this request, but the headers are useful'),
    __metadata("design:type", Object)
], HttpStatus, "NO_CONTENT", void 0);
__decorate([
    Description('Reset Content - The server requires that the client reset the document view'),
    __metadata("design:type", Object)
], HttpStatus, "RESET_CONTENT", void 0);
__decorate([
    Description('Partial Content - The server is delivering only part of the resource (byte serving) due to a range header sent by the client'),
    __metadata("design:type", Object)
], HttpStatus, "PARTIAL_CONTENT", void 0);
__decorate([
    Description('Multiple Choices - The request has more than one possible responses. User-agent or user should choose one of them'),
    __metadata("design:type", Object)
], HttpStatus, "MULTIPLE_CHOICES", void 0);
__decorate([
    Description('Moved Permanently - The URL of the requested resource has been changed permanently. The new URL is given in the response.'),
    __metadata("design:type", Object)
], HttpStatus, "MOVED_PERMANENTLY", void 0);
__decorate([
    Description('Found - The URL of the requested resource has been changed temporarily. The new URL is given in the response.'),
    __metadata("design:type", Object)
], HttpStatus, "FOUND", void 0);
__decorate([
    Description('See Other - The server sent this response to direct the client to get the requested resource at another URI with a GET request.'),
    __metadata("design:type", Object)
], HttpStatus, "SEE_OTHER", void 0);
__decorate([
    Description('Not Modified - This is used for caching purposes. It tells the client that response has not been modified, so client can continue to use same cached version of response.'),
    __metadata("design:type", Object)
], HttpStatus, "NOT_MODIFIED", void 0);
__decorate([
    Description('Use Proxy - Was defined in a previous version of HTTP specification to indicate that a requested response must be accessed by a proxy'),
    __metadata("design:type", Object)
], HttpStatus, "USE_PROXY", void 0);
__decorate([
    Description('Temporary Redirect - The server sends this response to direct the client to get the requested resource at another URI with same method that was used in the prior request.'),
    __metadata("design:type", Object)
], HttpStatus, "TEMPORARY_REDIRECT", void 0);
__decorate([
    Description('Permanent Redirect - This means that the resource is now permanently located at another URI, specified by the Location: HTTP Response header.'),
    __metadata("design:type", Object)
], HttpStatus, "PERMANENT_REDIRECT", void 0);
__decorate([
    Description('Bad Request - The server cannot or will not process the request due to something that is perceived to be a client error'),
    __metadata("design:type", Object)
], HttpStatus, "BAD_REQUEST", void 0);
__decorate([
    Description('Unauthorized - Although the HTTP standard specifies "unauthorized", semantically this response means "unauthenticated". That is, the client must authenticate itself to get the requested response'),
    __metadata("design:type", Object)
], HttpStatus, "UNAUTHORIZED", void 0);
__decorate([
    Description('Payment Required - This code is reserved for future use.'),
    __metadata("design:type", Object)
], HttpStatus, "PAYMENT_REQUIRED", void 0);
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
    Description('Not Acceptable - This response is sent when the web server, after performing server-driven content negotiation, doesn\'t find any content following the criteria given by the user agent.'),
    __metadata("design:type", Object)
], HttpStatus, "NOT_ACCEPTABLE", void 0);
__decorate([
    Description('Proxy Authentication Required - This is similar to 401 Unauthorized but authentication is needed to be done by a proxy.'),
    __metadata("design:type", Object)
], HttpStatus, "PROXY_AUTHENTICATION_REQUIRED", void 0);
__decorate([
    Description('Request Timeout - This response is sent on an idle connection by some servers, even without any previous request by client.'),
    __metadata("design:type", Object)
], HttpStatus, "REQUEST_TIMEOUT", void 0);
__decorate([
    Description('Conflict - This response is sent when a request conflicts with the current state of the server.'),
    __metadata("design:type", Object)
], HttpStatus, "CONFLICT", void 0);
__decorate([
    Description('Gone - This response is sent when the requested content has been permanently deleted from server'),
    __metadata("design:type", Object)
], HttpStatus, "GONE", void 0);
__decorate([
    Description('Length Required - Server rejected the request because the Content-Length header field is not defined and the server requires it.'),
    __metadata("design:type", Object)
], HttpStatus, "LENGTH_REQUIRED", void 0);
__decorate([
    Description('Precondition Failed - The client has indicated preconditions in its headers which the server does not meet.'),
    __metadata("design:type", Object)
], HttpStatus, "PRECONDITION_FAILED", void 0);
__decorate([
    Description('Payload Too Large - Request entity is larger than limits defined by server; the server might close the connection or return an Retry-After header field.'),
    __metadata("design:type", Object)
], HttpStatus, "PAYLOAD_TOO_LARGE", void 0);
__decorate([
    Description('URI Too Long - The URI requested by the client is longer than the server is willing to interpret.'),
    __metadata("design:type", Object)
], HttpStatus, "URI_TOO_LONG", void 0);
__decorate([
    Description('Unsupported Media Type - The media format of the requested data is not supported by the server, so the server is rejecting the request'),
    __metadata("design:type", Object)
], HttpStatus, "UNSUPPORTED_MEDIA_TYPE", void 0);
__decorate([
    Description('Range Not Satisfiable - The range specified by the Range header field in the request cannot be fulfilled; it\'s possible that the range is outside the size of the target URI\'s data.'),
    __metadata("design:type", Object)
], HttpStatus, "RANGE_NOT_SATISFIABLE", void 0);
__decorate([
    Description('Expectation Failed - This response code means the expectation indicated by the Expect request header field cannot be met by the server.'),
    __metadata("design:type", Object)
], HttpStatus, "EXPECTATION_FAILED", void 0);
__decorate([
    Description('I\'m a teapot - The server refuses the attempt to brew coffee with a teapot.'),
    __metadata("design:type", Object)
], HttpStatus, "IM_A_TEAPOT", void 0);
__decorate([
    Description('Misdirected Request - The server is not able to produce a response for the request URI because a different server is handling requests for that URI.'),
    __metadata("design:type", Object)
], HttpStatus, "MISDIRECTED_REQUEST", void 0);
__decorate([
    Description('Unprocessable Entity - The request was well-formed but was unable to be followed due to semantic errors.'),
    __metadata("design:type", Object)
], HttpStatus, "UNPROCESSABLE_ENTITY", void 0);
__decorate([
    Description('Locked - The resource that is being accessed is locked.'),
    __metadata("design:type", Object)
], HttpStatus, "LOCKED", void 0);
__decorate([
    Description('Failed Dependency - The request failed due to failure of a previous request.'),
    __metadata("design:type", Object)
], HttpStatus, "FAILED_DEPENDENCY", void 0);
__decorate([
    Description('Too Early - The server is unwilling to risk processing a request that might be replayed.'),
    __metadata("design:type", Object)
], HttpStatus, "TOO_EARLY", void 0);
__decorate([
    Description('Upgrade Required - The server refuses to perform the request using the current protocol but might be willing to do so after the client upgrades to a different protocol.'),
    __metadata("design:type", Object)
], HttpStatus, "UPGRADE_REQUIRED", void 0);
__decorate([
    Description('Precondition Required - The origin server requires the request to be conditional.'),
    __metadata("design:type", Object)
], HttpStatus, "PRECONDITION_REQUIRED", void 0);
__decorate([
    Description('Too Many Requests - The user has sent too many requests in a given amount of time'),
    __metadata("design:type", Object)
], HttpStatus, "TOO_MANY_REQUEST", void 0);
__decorate([
    Description('Request Header Fields Too Large - The server is unwilling to process the request because its header fields are too large.'),
    __metadata("design:type", Object)
], HttpStatus, "REQUEST_HEADER_FIELDS_TOO_LARGE", void 0);
__decorate([
    Description('Unavailable For Legal Reasons - The user-agent requested a resource that cannot legally be provided, such as a web page censored by a government.'),
    __metadata("design:type", Object)
], HttpStatus, "UNAVAILABLE_FOR_LEGAL_REASONS", void 0);
__decorate([
    Description('Internal Server Error - The server has encountered a situation it does not know how to handle'),
    __metadata("design:type", Object)
], HttpStatus, "INTERNAL_SERVER_ERROR", void 0);
__decorate([
    Description('Not Implemented - The request method is not supported by the server and cannot be handled'),
    __metadata("design:type", Object)
], HttpStatus, "NOT_IMPLEMENTED", void 0);
__decorate([
    Description('Bad Gateway - The server, while acting as a gateway or proxy, received an invalid response from the upstream server.'),
    __metadata("design:type", Object)
], HttpStatus, "BAD_GATEWAY", void 0);
__decorate([
    Description('Service Unavailable - The server is not ready to handle the request. Common causes are a server that is down for maintenance or that is overloaded'),
    __metadata("design:type", Object)
], HttpStatus, "SERVICE_UNAVAILABLE", void 0);
__decorate([
    Description('Gateway Timeout - The server, while acting as a gateway or proxy, did not receive a timely response from the upstream server.'),
    __metadata("design:type", Object)
], HttpStatus, "GATEWAY_TIMEOUT", void 0);
__decorate([
    Description('HTTP Version Not Supported - The HTTP version used in the request is not supported by the server.'),
    __metadata("design:type", Object)
], HttpStatus, "HTTP_VERSION_NOT_SUPPORTED", void 0);
__decorate([
    Description('Variant Also Negotiates - Transparent content negotiation for the request results in a circular reference.'),
    __metadata("design:type", Object)
], HttpStatus, "VARIANT_ALSO_NEGOTIATES", void 0);
__decorate([
    Description('Insufficient Storage - The server is unable to store the representation needed to complete the request.'),
    __metadata("design:type", Object)
], HttpStatus, "INSUFFICIENT_STORAGE", void 0);
__decorate([
    Description('Loop Detected - The server detected an infinite loop while processing the request.'),
    __metadata("design:type", Object)
], HttpStatus, "LOOP_DETECTED", void 0);
__decorate([
    Description('Not Extended - Further extensions to the request are required for the server to fulfill it.'),
    __metadata("design:type", Object)
], HttpStatus, "NOT_EXTENDED", void 0);
__decorate([
    Description('Network Authentication Required - The client needs to authenticate to gain network access.'),
    __metadata("design:type", Object)
], HttpStatus, "NETWORK_AUTHENTICATION_REQUIRED", void 0);
class AppError extends Error {
    constructor(statusCode, message, isOperational = true, details) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = isOperational; // Allow setting operational status
        this.details = details;
        Error.captureStackTrace(this, this.constructor);
    }
    get description() {
        return STATUS_DESCRIPTIONS[this.statusCode] || 'Unknown Status';
    }
    // ----------------------------
    // Predefined Factory Methods (Static Methods on AppError)
    // ----------------------------
    static OK(message = 'Success', details) {
        return new AppError(HttpStatus.OK, message, true, details);
    }
    static Created(message = 'Created', details) {
        return new AppError(HttpStatus.CREATED, message, true, details);
    }
    static Accepted(message = 'Accepted', details) {
        return new AppError(HttpStatus.ACCEPTED, message, true, details);
    }
    static NoContent(message = 'No Content', details) {
        return new AppError(HttpStatus.NO_CONTENT, message, true, details);
    }
    static BadRequest(message = 'Bad Request', details) {
        return new AppError(HttpStatus.BAD_REQUEST, message, true, details);
    }
    static Unauthorized(message = 'Unauthorized', details) {
        return new AppError(HttpStatus.UNAUTHORIZED, message, true, details);
    }
    static Forbidden(message = 'Forbidden', details) {
        return new AppError(HttpStatus.FORBIDDEN, message, true, details);
    }
    static NotFound(message = 'Not Found', details) {
        return new AppError(HttpStatus.NOT_FOUND, message, true, details);
    }
    static MethodNotAllowed(message = 'Method Not Allowed', details) {
        return new AppError(HttpStatus.METHOD_NOT_ALLOWED, message, true, details);
    }
    static Gone(message = 'Gone', details) {
        return new AppError(HttpStatus.GONE, message, true, details);
    }
    static UnsupportedMediaType(message = 'Unsupported Media Type', details) {
        return new AppError(HttpStatus.UNSUPPORTED_MEDIA_TYPE, message, true, details);
    }
    static TooManyRequests(message = 'Too Many Requests', details) {
        return new AppError(HttpStatus.TOO_MANY_REQUEST, message, true, details);
    }
    static InternalServerError(message = 'Internal Server Error', details) {
        return new AppError(HttpStatus.INTERNAL_SERVER_ERROR, message, false, details); // Potentially not operational
    }
    static NotImplemented(message = 'Not Implemented', details) {
        return new AppError(HttpStatus.NOT_IMPLEMENTED, message, false, details); // Potentially not operational
    }
    static ServiceUnavailable(message = 'Service Unavailable', details) {
        return new AppError(HttpStatus.SERVICE_UNAVAILABLE, message, false, details); // Potentially not operational
    }
}
exports.AppError = AppError;
