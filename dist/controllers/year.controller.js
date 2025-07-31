"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YearController = void 0;
const httpException_1 = require("../exceptions/httpException");
const api_response_1 = require("../utils/api-response");
class YearController {
    constructor(yearService) {
        this.getYears = async (req, res) => {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
            try {
                const result = await this.yearService.getYears();
                if (result) {
                    api_response_1.ApiResponse.success({
                        res,
                        req,
                        data: result,
                        message: `All Avalable Years Retrived` // Include pagination metadata
                    });
                }
                else {
                    throw httpException_1.HttpException.NotFound(`Years not found`);
                }
            }
            catch (error) {
                if (error instanceof httpException_1.HttpException) {
                    throw error;
                }
                else {
                    throw httpException_1.HttpException.InternalServerError(`Something Went Wrong`, error);
                }
            }
        };
        this.getYearById = async (req, res) => {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
            const yearId = parseInt(req.params.id);
            try {
                const result = await this.yearService.getYearsById(yearId);
                if (result) {
                    api_response_1.ApiResponse.success({
                        res,
                        req,
                        data: result,
                        message: `Year retrived for id ${yearId}` // Include pagination metadata
                    });
                }
                else {
                    throw httpException_1.HttpException.NotFound(`Years not found`);
                }
            }
            catch (error) {
                if (error instanceof httpException_1.HttpException) {
                    throw error;
                }
                else {
                    throw httpException_1.HttpException.InternalServerError(`Something Went Wrong`);
                }
            }
        };
        this.yearService = yearService;
        this.yearService.initialize();
    }
}
exports.YearController = YearController;
