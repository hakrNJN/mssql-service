//src/controllers/year.controller.ts
import { Request, Response } from 'express';
import { HttpException } from '../exceptions/httpException';
import { YearService } from '../services/years.service';
import { ApiResponse } from '../utils/api-response';

export class YearController {

    private yearService: YearService;

    constructor(yearService: YearService) {
        this.yearService = yearService;
        this.yearService.initialize()
    }

    public getYears = async (req: Request, res: Response): Promise<void> => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        try {
            const result = await this.yearService.getYears()
            if (result) {
                ApiResponse.success({
                    res,
                    req,
                    data: result,
                    message: `All Available Years Retrieved`// Include pagination metadata
                });
            } else {
                throw HttpException.NotFound(`Years not found`);
            }
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            } else {
                throw HttpException.InternalServerError(`Something Went Wrong`, error);
            }
        }

    }

    public getYearById = async (req: Request, res: Response): Promise<void> => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const yearId = parseInt(req.params.id as string)
        try {
            const result = await this.yearService.getYearsById(yearId)
            if (result) {
                ApiResponse.success({
                    res,
                    req,
                    data: result,
                    message: `Year retrieved for id ${yearId}`// Include pagination metadata
                });
            } else {
                throw HttpException.NotFound(`Years not found`);
            }
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            } else {
                throw HttpException.InternalServerError(`Something Went Wrong`);
            }
        }
    }
}