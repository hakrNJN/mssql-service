"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaleTransactionController = void 0;
const httpException_1 = require("../exceptions/httpException");
const api_response_1 = require("../utils/api-response");
class SaleTransactionController {
    constructor(saleTransactionService) {
        this.getTransactionById = async (req, res) => {
            const SalTrnId = parseInt(req.params.id);
            try {
                const result = await this.saleTransactionService.getTransactionById(SalTrnId);
                if (result) {
                    api_response_1.ApiResponse.success({
                        res,
                        req,
                        data: result,
                        message: `Transaction retrived for id ${SalTrnId}` // Include pagination metadata
                    });
                }
                else {
                    throw httpException_1.HttpException.NotFound(`Transactions not found`);
                }
            }
            catch (error) {
                if (error instanceof httpException_1.HttpException) {
                    throw error;
                }
                throw httpException_1.HttpException.InternalServerError(`Something Went Wrong`);
            }
        };
        this.saleTransactionService = saleTransactionService;
        this.saleTransactionService.initialize();
    }
}
exports.SaleTransactionController = SaleTransactionController;
