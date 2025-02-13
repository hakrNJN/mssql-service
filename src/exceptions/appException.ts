// src/exception/app.exception.ts

const STATUS_DESCRIPTIONS: Record<number, string> = {};

// Decorator to add descriptions to status codes
function Description(description: string) {
  return function (target: any, key: string) {
    const statusCode = target[key];
    STATUS_DESCRIPTIONS[statusCode] = description;
  };
}

// HTTP Status Map (as a class with static properties)
export class HttpStatus {
  @Description('OK - The request succeeded')
  static OK = 200;

  @Description('Created - The request succeeded, and a new resource was created as a result')
  static CREATED = 201;

  @Description('Accepted - The request has been accepted for processing, but the processing has not been completed')
  static ACCEPTED = 202;

  @Description('Non-Authoritative Information - The server is a transforming proxy that received a 200 OK from its origin, but is returning a modified version')
  static NON_AUTHORITATIVE = 203;

  @Description('No Content - There is no content to send for this request, but the headers are useful')
  static NO_CONTENT = 204;

  @Description('Reset Content - The server requires that the client reset the document view')
  static RESET_CONTENT = 205;

  @Description('Partial Content - The server is delivering only part of the resource (byte serving) due to a range header sent by the client')
  static PARTIAL_CONTENT = 206;

  @Description('Multiple Choices - The request has more than one possible responses. User-agent or user should choose one of them')
  static MULTIPLE_CHOICES = 300;

  @Description('Moved Permanently - The URL of the requested resource has been changed permanently. The new URL is given in the response.')
  static MOVED_PERMANENTLY = 301;

  @Description('Found - The URL of the requested resource has been changed temporarily. The new URL is given in the response.')
  static FOUND = 302;

  @Description('See Other - The server sent this response to direct the client to get the requested resource at another URI with a GET request.')
  static SEE_OTHER = 303;

  @Description('Not Modified - This is used for caching purposes. It tells the client that response has not been modified, so client can continue to use same cached version of response.')
  static NOT_MODIFIED = 304;

  @Description('Use Proxy - Was defined in a previous version of HTTP specification to indicate that a requested response must be accessed by a proxy')
  static USE_PROXY = 305; // No longer recommended

  @Description('Temporary Redirect - The server sends this response to direct the client to get the requested resource at another URI with same method that was used in the prior request.')
  static TEMPORARY_REDIRECT = 307;

  @Description('Permanent Redirect - This means that the resource is now permanently located at another URI, specified by the Location: HTTP Response header.')
  static PERMANENT_REDIRECT = 308;

  @Description('Bad Request - The server cannot or will not process the request due to something that is perceived to be a client error')
  static BAD_REQUEST = 400;

  @Description('Unauthorized - Although the HTTP standard specifies "unauthorized", semantically this response means "unauthenticated". That is, the client must authenticate itself to get the requested response')
  static UNAUTHORIZED = 401;

  @Description('Payment Required - This code is reserved for future use.')
  static PAYMENT_REQUIRED = 402;

  @Description('Forbidden - The client does not have access rights to the content; that is, it is unauthorized, so the server is refusing to give the requested resource')
  static FORBIDDEN = 403;

  @Description('Not Found - The server cannot find the requested resource')
  static NOT_FOUND = 404;

  @Description('Method Not Allowed - The request method is known by the server but is not supported by the target resource')
  static METHOD_NOT_ALLOWED = 405;

  @Description('Not Acceptable - This response is sent when the web server, after performing server-driven content negotiation, doesn\'t find any content following the criteria given by the user agent.')
  static NOT_ACCEPTABLE = 406;

  @Description('Proxy Authentication Required - This is similar to 401 Unauthorized but authentication is needed to be done by a proxy.')
  static PROXY_AUTHENTICATION_REQUIRED = 407;

  @Description('Request Timeout - This response is sent on an idle connection by some servers, even without any previous request by client.')
  static REQUEST_TIMEOUT = 408;

  @Description('Conflict - This response is sent when a request conflicts with the current state of the server.')
  static CONFLICT = 409;

  @Description('Gone - This response is sent when the requested content has been permanently deleted from server')
  static GONE = 410; // Renamed from EXPIRED to GONE for standard HTTP term

  @Description('Length Required - Server rejected the request because the Content-Length header field is not defined and the server requires it.')
  static LENGTH_REQUIRED = 411;

  @Description('Precondition Failed - The client has indicated preconditions in its headers which the server does not meet.')
  static PRECONDITION_FAILED = 412;

  @Description('Payload Too Large - Request entity is larger than limits defined by server; the server might close the connection or return an Retry-After header field.')
  static PAYLOAD_TOO_LARGE = 413;

  @Description('URI Too Long - The URI requested by the client is longer than the server is willing to interpret.')
  static URI_TOO_LONG = 414;

  @Description('Unsupported Media Type - The media format of the requested data is not supported by the server, so the server is rejecting the request')
  static UNSUPPORTED_MEDIA_TYPE = 415;

  @Description('Range Not Satisfiable - The range specified by the Range header field in the request cannot be fulfilled; it\'s possible that the range is outside the size of the target URI\'s data.')
  static RANGE_NOT_SATISFIABLE = 416;

  @Description('Expectation Failed - This response code means the expectation indicated by the Expect request header field cannot be met by the server.')
  static EXPECTATION_FAILED = 417;

  @Description('I\'m a teapot - The server refuses the attempt to brew coffee with a teapot.')
  static IM_A_TEAPOT = 418; // HTTP Tea Pot joke

  @Description('Misdirected Request - The server is not able to produce a response for the request URI because a different server is handling requests for that URI.')
  static MISDIRECTED_REQUEST = 421;

  @Description('Unprocessable Entity - The request was well-formed but was unable to be followed due to semantic errors.')
  static UNPROCESSABLE_ENTITY = 422;

  @Description('Locked - The resource that is being accessed is locked.')
  static LOCKED = 423;

  @Description('Failed Dependency - The request failed due to failure of a previous request.')
  static FAILED_DEPENDENCY = 424;

  @Description('Too Early - The server is unwilling to risk processing a request that might be replayed.')
  static TOO_EARLY = 425;

  @Description('Upgrade Required - The server refuses to perform the request using the current protocol but might be willing to do so after the client upgrades to a different protocol.')
  static UPGRADE_REQUIRED = 426;

  @Description('Precondition Required - The origin server requires the request to be conditional.')
  static PRECONDITION_REQUIRED = 428;

  @Description('Too Many Requests - The user has sent too many requests in a given amount of time')
  static TOO_MANY_REQUEST = 429;

  @Description('Request Header Fields Too Large - The server is unwilling to process the request because its header fields are too large.')
  static REQUEST_HEADER_FIELDS_TOO_LARGE = 431;

  @Description('Unavailable For Legal Reasons - The user-agent requested a resource that cannot legally be provided, such as a web page censored by a government.')
  static UNAVAILABLE_FOR_LEGAL_REASONS = 451;

  @Description('Internal Server Error - The server has encountered a situation it does not know how to handle')
  static INTERNAL_SERVER_ERROR = 500;

  @Description('Not Implemented - The request method is not supported by the server and cannot be handled')
  static NOT_IMPLEMENTED = 501;

  @Description('Bad Gateway - The server, while acting as a gateway or proxy, received an invalid response from the upstream server.')
  static BAD_GATEWAY = 502;

  @Description('Service Unavailable - The server is not ready to handle the request. Common causes are a server that is down for maintenance or that is overloaded')
  static SERVICE_UNAVAILABLE = 503;

  @Description('Gateway Timeout - The server, while acting as a gateway or proxy, did not receive a timely response from the upstream server.')
  static GATEWAY_TIMEOUT = 504;

  @Description('HTTP Version Not Supported - The HTTP version used in the request is not supported by the server.')
  static HTTP_VERSION_NOT_SUPPORTED = 505;

  @Description('Variant Also Negotiates - Transparent content negotiation for the request results in a circular reference.')
  static VARIANT_ALSO_NEGOTIATES = 506;

  @Description('Insufficient Storage - The server is unable to store the representation needed to complete the request.')
  static INSUFFICIENT_STORAGE = 507;

  @Description('Loop Detected - The server detected an infinite loop while processing the request.')
  static LOOP_DETECTED = 508;

  @Description('Not Extended - Further extensions to the request are required for the server to fulfill it.')
  static NOT_EXTENDED = 510;

  @Description('Network Authentication Required - The client needs to authenticate to gain network access.')
  static NETWORK_AUTHENTICATION_REQUIRED = 511;

  // Add more status codes as needed... (Many more HTTP status codes exist)
}


export class AppError extends Error {
  public statusCode: number;
  public status: string;
  public isOperational: boolean;
  public details?: any;

  constructor(statusCode: number, message: string, isOperational = true, details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = isOperational; // Allow setting operational status
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }

  get description(): string {
    return STATUS_DESCRIPTIONS[this.statusCode] || 'Unknown Status';
  }

  // ----------------------------
  // Predefined Factory Methods (Static Methods on AppError)
  // ----------------------------
  static OK(message = 'Success', details?: any) {
    return new AppError(HttpStatus.OK, message, true, details);
  }

  static Created(message = 'Created', details?: any) {
    return new AppError(HttpStatus.CREATED, message, true, details);
  }

  static Accepted(message = 'Accepted', details?: any) {
    return new AppError(HttpStatus.ACCEPTED, message, true, details);
  }

  static NoContent(message = 'No Content', details?: any) {
    return new AppError(HttpStatus.NO_CONTENT, message, true, details);
  }

  static BadRequest(message = 'Bad Request', details?: any) {
    return new AppError(HttpStatus.BAD_REQUEST, message, true, details);
  }

  static Unauthorized(message = 'Unauthorized', details?: any) {
    return new AppError(HttpStatus.UNAUTHORIZED, message, true, details);
  }

  static Forbidden(message = 'Forbidden', details?: any) {
    return new AppError(HttpStatus.FORBIDDEN, message, true, details);
  }

  static NotFound(message = 'Not Found', details?: any) {
    return new AppError(HttpStatus.NOT_FOUND, message, true, details);
  }

  static MethodNotAllowed(message = 'Method Not Allowed', details?: any) {
    return new AppError(HttpStatus.METHOD_NOT_ALLOWED, message, true, details);
  }

  static Gone(message = 'Gone', details?: any) { // Renamed to Gone to match HttpStatus
    return new AppError(HttpStatus.GONE, message, true, details);
  }

  static UnsupportedMediaType(message = 'Unsupported Media Type', details?: any) {
    return new AppError(HttpStatus.UNSUPPORTED_MEDIA_TYPE, message, true, details);
  }

  static TooManyRequests(message = 'Too Many Requests', details?: any) { // Corrected method name
    return new AppError(HttpStatus.TOO_MANY_REQUEST, message, true, details);
  }

  static InternalServerError(message = 'Internal Server Error', details?: any) {
    return new AppError(HttpStatus.INTERNAL_SERVER_ERROR, message, false, details); // Potentially not operational
  }

  static NotImplemented(message = 'Not Implemented', details?: any) {
    return new AppError(HttpStatus.NOT_IMPLEMENTED, message, false, details); // Potentially not operational
  }

  static ServiceUnavailable(message = 'Service Unavailable', details?: any) {
    return new AppError(HttpStatus.SERVICE_UNAVAILABLE, message, false, details); // Potentially not operational
  }

  // Add more factory methods for other HTTP status codes as needed...
}