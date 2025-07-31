"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyController = void 0;
const httpException_1 = require("../exceptions/httpException");
const api_response_1 = require("../utils/api-response");
class CompanyController {
    constructor(companyService) {
        this.getCompanies = async (req, res) => {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
            try {
                const result = await this.companyService.getCompanies();
                if (result) {
                    api_response_1.ApiResponse.success({
                        res,
                        req,
                        data: result,
                        message: `All Avalable Company Retrived` // Include pagination metadata
                    });
                }
                else {
                    throw httpException_1.HttpException.NotFound(`Companies not found`);
                }
            }
            catch (error) {
                if (error instanceof httpException_1.HttpException) {
                    throw error;
                }
                throw httpException_1.HttpException.InternalServerError(`Something Went Wrong`, error);
            }
        };
        this.getCompanyById = async (req, res) => {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
            const comapnyId = parseInt(req.params.id);
            try {
                const result = await this.companyService.getCompanyById(comapnyId);
                if (result) {
                    api_response_1.ApiResponse.success({
                        res,
                        req,
                        data: result,
                        message: `Company retrived for id ${comapnyId}` // Include pagination metadata
                    });
                }
                else {
                    throw httpException_1.HttpException.NotFound(`Company not found`);
                }
            }
            catch (error) {
                if (error instanceof httpException_1.HttpException) {
                    throw error;
                }
                throw httpException_1.HttpException.InternalServerError(`Something Went Wrong`, error);
            }
        };
        this.getCompanyByGSTIN = async (req, res) => {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
            const GSTIN = req.params.gstin;
            const filters = {
                GST: { equal: GSTIN }
            };
            try {
                const result = await this.companyService.getCompaniesWithFilters(filters);
                if (result) {
                    api_response_1.ApiResponse.success({
                        res,
                        req,
                        data: result,
                        message: `Company retrived for GSTIN ${GSTIN}` // Include pagination metadata
                    });
                }
                else {
                    throw httpException_1.HttpException.NotFound(`Company not found`);
                }
            }
            catch (error) {
                if (error instanceof httpException_1.HttpException) {
                    throw error;
                }
                throw httpException_1.HttpException.InternalServerError(`Something Went Wrong`, error);
            }
        };
        this.companyService = companyService;
        this.companyService.initialize();
    }
}
exports.CompanyController = CompanyController;
