import { Request } from 'express';
interface PaginationParams {
    page: number;
    limit: number;
    startIndex: number;
    endIndex: number;
    paginationMetadata: {
        page: number;
        perPage: number;
    };
}
export declare function getPaginationParams(req: Request): PaginationParams;
export {};
