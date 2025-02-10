//src/controllers/year.controller.ts
import { Request, Response } from 'express';
import { HttpException } from '../exceptions/httpException';
import { YearService } from '../services/years.service';
import { ApiResponse } from '../utils/api-response';

export class YearController { 

    private yearService: YearService;

    constructor(yearService: YearService) {
        this.yearService = yearService;
        /* The line `this.yearService.initialize()` in the constructor of the `YearController` class is likely calling a method named `initialize` on the `yearService` instance. */
        this.yearService.initialize()
    }



    public getYears = async (req: Request, res: Response): Promise<void> => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        try {
            const result = await this.yearService.getYears()
            console.log(result)
            if (result) {
                ApiResponse.success({
                    res,
                    data: result,
                    message: `All Avalable Year Retrived`// Include pagination metadata
                });
            } else {
                throw HttpException.NotFound(`Tests not found`);
            }
        } catch (error) {
            throw HttpException.InternalServerError(`Something Went Wrong`,error);
        }
        
    }

    public getYearById = async (req: Request, res: Response): Promise<void> => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const yearId =parseInt( req.params.id as string)
        try {
            const result = await this.yearService.getYearsById(yearId)
            if (result) {
                ApiResponse.success({
                    res,
                    data: result,
                    message: `year retrived for ${yearId}`// Include pagination metadata
                });
            } else {
                throw HttpException.NotFound(`Tests not found`);
            }
        } catch (error) {
            throw HttpException.InternalServerError(`Something Went Wrong`);
        }
    }
}