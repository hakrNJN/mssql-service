"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaginationParams = getPaginationParams;
function getPaginationParams(req) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginationMetadata = {
        page: page,
        perPage: limit,
    };
    return { page, limit, startIndex, endIndex, paginationMetadata };
}
