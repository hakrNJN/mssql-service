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

export function getPaginationParams(req: Request): PaginationParams {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 100;
    const startIndex: number = (page - 1) * limit;
    const endIndex: number = page * limit;

    const paginationMetadata = {
        page: page,
        perPage: limit,
    };

    return { page, limit, startIndex, endIndex, paginationMetadata };
}
