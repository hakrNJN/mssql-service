//src/controllers/saleTransaction.controller.ts
import { Request, Response } from 'express';
import { HttpException } from '../exceptions/httpException';
import { SaleTransactionService } from '../services/saleTransaction.service';
import { ApiResponse } from '../utils/api-response';

export class SaleTransactionController {

    private saleTransactionService: SaleTransactionService;

    constructor(saleTransactionService: SaleTransactionService) {
        this.saleTransactionService = saleTransactionService;
        this.saleTransactionService.initialize()
    }

    public getTransactionById = async (req: Request, res: Response): Promise<void> => {

        const SalTrnId =parseInt( req.params.id as string)
        try {
            const result = await this.saleTransactionService.getTransactionById(SalTrnId)
            if (result) {
                ApiResponse.success({
                    res,
                    req,
                    data: result,
                    message: `Transaction retrived for id ${SalTrnId}`// Include pagination metadata
                });
            } else {
                throw HttpException.NotFound(`Transactions not found`);
            }
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw HttpException.InternalServerError(`Something Went Wrong`);
        }
    }

}
