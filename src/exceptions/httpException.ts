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

  @Description('No Content - There is no content to send for this request, but the headers are useful')
  static NO_CONTENT = 204;

  @Description('Moved Permanently - The URL of the requested resource has been changed permanently. The new URL is given in the response.')
  static MOVED_PERMANENTLY = 301;

  @Description('Bad Request - The server cannot or will not process the request due to something that is perceived to be a client error')
  static BAD_REQUEST = 400;

  @Description('Unauthorized - Although the HTTP standard specifies "unauthorized", semantically this response means "unauthenticated". That is, the client must authenticate itself to get the requested response')
  static UNAUTHORIZED = 401;

  @Description('Forbidden - The client does not have access rights to the content; that is, it is unauthorized, so the server is refusing to give the requested resource')
  static FORBIDDEN = 403;

  @Description('Not Found - The server cannot find the requested resource')
  static NOT_FOUND = 404;

  @Description('Method Not Allowed - The request method is known by the server but is not supported by the target resource')
  static METHOD_NOT_ALLOWED = 405;

  @Description('Expired - This response is sent when the requested content has been permanently deleted from server')
  static EXPIRED = 410;

  @Description('Unsupported Media Type - The media format of the requested data is not supported by the server, so the server is rejecting the request')
  static UNSUPPORTED_MEDIA_TYPE = 415;

  @Description('Too Many Requests - The user has sent too many requests in a given amount of time')
  static TOO_MANY_REQUEST = 429;

  @Description('Internal Server Error - The server has encountered a situation it does not know how to handle')
  static INTERNAL_SERVER_ERROR = 500;

  @Description('Not Implemented - The request method is not supported by the server and cannot be handled')
  static NOT_IMPLEMENTED = 501;

  @Description('Service Unavailable - The server is not ready to handle the request. Common causes are a server that is down for maintenance or that is overloaded')
  static SERVICE_UNAVAILABLE = 503;

  // Add more status codes as needed...
}

export class HttpException extends Error {
  public status: number;
  public message: string;
  public details?: any;

  constructor(status: number, message: string, details ?:any) {
    super(message);
    this.status = status;
    this.message = message;
     this.details = details!
  }

  get description(): string {
    return STATUS_DESCRIPTIONS[this.status] || 'Unknown Status';
  }

  // ----------------------------
  // 3. Predefined Factory Methods
  // ----------------------------
  static NotFound(message = 'Resource not found', details?: any) {
    return new HttpException(HttpStatus.NOT_FOUND, message, details);
  }

  static InternalServerError(message = 'Internal server error', details?: any) {
    return new HttpException(HttpStatus.INTERNAL_SERVER_ERROR, message, details);
  }

  static BadRequest(message = 'Invalid request', details?: any) {
    return new HttpException(HttpStatus.BAD_REQUEST, message, details);
  }

  static TooManyRequest(message = 'Too Many Request in a Short Period', details?: any) {
    return new HttpException(HttpStatus.TOO_MANY_REQUEST, message, details);
  }

  static UnAuthorised(message = 'You are not authorised', details?: any) {
    return new HttpException(HttpStatus.UNAUTHORIZED, message, details);
  }

  static Expired(message = 'Code has expired', details?: any) {
    return new HttpException(HttpStatus.EXPIRED, message, details);
  }
}