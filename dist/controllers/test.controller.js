"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestController = void 0;
const tsyringe_1 = require("tsyringe");
const httpException_1 = require("../exceptions/httpException");
const api_response_1 = require("../utils/api-response");
const logger_1 = require("../utils/logger");
class TestController {
    constructor() {
        this.getAllTests = async (req, res) => {
            console.log('getting req');
            try {
                // Simulate fetching data with pagination (replace with actual logic)
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const startIndex = (page - 1) * limit;
                const endIndex = page * limit;
                const allTests = [
                    { id: 1, name: 'Test 1' }, { id: 2, name: 'Test 2' }, { id: 3, name: 'Test 3' },
                    { id: 4, name: 'Test 4' }, { id: 5, name: 'Test 5' }, { id: 6, name: 'Test 6' },
                    { id: 7, name: 'Test 7' }, { id: 8, name: 'Test 8' }, { id: 9, name: 'Test 9' },
                    { id: 10, name: 'Test 10' }, { id: 11, name: 'Test 11' }, { id: 12, name: 'Test 12' },
                    { id: 13, name: 'Test 13' }, { id: 14, name: 'Test 14' }, { id: 15, name: 'Test 15' },
                ];
                const paginatedTests = allTests.slice(startIndex, endIndex);
                const totalTests = allTests.length;
                const paginationMetadata = {
                    totalCount: totalTests,
                    page: page,
                    perPage: limit,
                    totalPages: Math.ceil(totalTests / limit),
                    // You could add next/prev page URLs here if you want to generate them
                };
                if (paginatedTests && paginatedTests.length > 0) {
                    api_response_1.ApiResponse.success({
                        res,
                        req,
                        data: paginatedTests,
                        message: `Tests retrieved (page ${page})`,
                        metadata: paginationMetadata, // Include pagination metadata
                    });
                }
                else {
                    throw httpException_1.HttpException.NotFound(`Tests not found`);
                }
            }
            catch (error) {
                this.logger.error('Error getting all tests:', error);
                if (error instanceof httpException_1.HttpException) {
                    throw error;
                }
                else {
                    throw httpException_1.HttpException.InternalServerError('Error getting tests', error);
                }
            }
        };
        this.logger = tsyringe_1.container.resolve(logger_1.WINSTON_LOGGER);
    }
}
exports.TestController = TestController;
