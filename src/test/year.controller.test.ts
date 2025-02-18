// __tests__/year.controller.test.ts
import { YearController } from '../src/controllers/year.controller';
import { YearService } from '../src/services/years.service';
import { Request, Response } from 'express';
import { HttpException } from '../src/exceptions/httpException';
import { AppDataSource } from '../src/providers/data-source.provider';
import { YearsProvider } from '../src/providers/years.provider';

jest.mock('../src/services/years.service', () => {
     return {
         YearService: jest.fn().mockImplementation(() => ({
             getYears: jest.fn(),
             getYearsById: jest.fn(),
             initialize: jest.fn()
         })),
     };
 });

describe('YearController', () => {
    let controller: YearController;
    let mockYearService: any;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: jest.Mock;
    let mockDataSource: any;

    beforeEach(() => {
        mockDataSource = new AppDataSource();
        mockYearService = new YearService(mockDataSource);
        controller = new YearController(mockYearService);

        mockRequest = {};
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn()
        };
        mockNext = jest.fn();
    });

    it('should get all years successfully', async () => {
        const mockYears = [{ id: 1, year: 2023 }, { id: 2, year: 2024 }];
         (YearService as jest.Mock).mockImplementation(() => {
             return {
                 getYears: jest.fn().mockResolvedValue(mockYears),
                 getYearsById: jest.fn(),
                 initialize: jest.fn()
             }
         });
        controller =  new YearController(mockYearService)
        mockRequest.query = {};

        await controller.getYears(mockRequest as Request, mockResponse as Response);

        expect(mockYearService.getYears).toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith(
            expect.objectContaining({
                success: true,
                data: mockYears,
                message: 'All Avalable Years Retrived'
            })
        );
    });

    it('should handle error when getting all years', async () => {
     (YearService as jest.Mock).mockImplementation(() => {
         return {
             getYears: jest.fn().mockRejectedValue(new Error('Database error')),
             getYearsById: jest.fn(),
             initialize: jest.fn()
         }
     });
        controller =  new YearController(mockYearService)
        mockRequest.query = {};

        await controller.getYears(mockRequest as Request, mockResponse as Response);

        expect(mockYearService.getYears).toHaveBeenCalled();
    });
});
