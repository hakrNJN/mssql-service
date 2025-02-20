import { Request, Response } from 'express';
import { HttpException } from '../exceptions/httpException';
import { ApiResponse } from '../utils/api-response';

export class TestController {

    public getAllTests = async (req: Request, res: Response): Promise<void> => {
        console.log('getting req')
        try {
            // Simulate fetching data with pagination (replace with actual logic)
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;

            const allTests = [ // Simulate all tests from database
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

            if (paginatedTests) {
                ApiResponse.success({
                    res,
                    req,
                    data: paginatedTests,
                    message: `Tests retrieved (page ${page})`,
                    metadata: paginationMetadata, // Include pagination metadata
                });
            } else {
                throw HttpException.NotFound(`Tests not found`);
            }
        } catch (error) {
            console.error('Error getting all tests:', error);
            throw HttpException.InternalServerError('Error getting tests', error);
        }
    };
}