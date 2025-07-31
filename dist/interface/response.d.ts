export interface StandardMetadata {
    requestId: string;
    apiVersion: string;
    timestamp: string;
    timeTaken?: number;
    timeTakenUnit?: string;
}
export interface PaginationMetadata {
    totalCount?: number;
    page?: number;
    perPage?: number;
    totalPages?: number;
}
export interface ApiResponseOptions<T> {
    res: Response;
    req: Request;
    statusCode?: number;
    message?: string;
    data?: T;
    metadata?: PaginationMetadata & Record<string, any>;
}
