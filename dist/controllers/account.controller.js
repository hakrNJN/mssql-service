"use strict";
//src/controllers/series.controller.ts
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountController = void 0;
const stringDecorators_1 = require("../decorators/stringDecorators");
const httpException_1 = require("../exceptions/httpException");
const account_service_1 = require("../services/account.service");
const api_response_1 = require("../utils/api-response");
const pagination_1 = require("../utils/pagination");
let AccountController = class AccountController {
    constructor(accountService) {
        this.getAllAccounts = async (req, res) => {
            const { startIndex, endIndex, paginationMetadata } = (0, pagination_1.getPaginationParams)(req);
            try {
                const result = await this.accountService.getAccounts(startIndex, endIndex);
                if (result) {
                    api_response_1.ApiResponse.success({
                        res,
                        req,
                        data: result,
                        message: `All Avalable Accounts Retrived`, // Include pagination metadata
                        metadata: paginationMetadata,
                    });
                }
                else {
                    throw httpException_1.HttpException.NotFound(`Account not found`);
                }
            }
            catch (error) {
                if (error instanceof httpException_1.HttpException) {
                    throw error;
                }
                throw httpException_1.HttpException.InternalServerError(`Something Went Wrong`, error);
            }
        };
        this.getAllCustomers = async (req, res) => {
            const { startIndex, endIndex, paginationMetadata } = (0, pagination_1.getPaginationParams)(req);
            try {
                const result = await this.accountService.getCustomers(startIndex, endIndex);
                if (result) {
                    api_response_1.ApiResponse.success({
                        res,
                        req,
                        data: result,
                        message: `All Avalable Accounts Retrived`, // Include pagination metadata
                        metadata: paginationMetadata,
                    });
                }
                else {
                    throw httpException_1.HttpException.NotFound(`Account not found`);
                }
            }
            catch (error) {
                if (error instanceof httpException_1.HttpException) {
                    throw error;
                }
                throw httpException_1.HttpException.InternalServerError(`Something Went Wrong`, error);
            }
        };
        this.getAllAgents = async (req, res) => {
            const { startIndex, endIndex, paginationMetadata } = (0, pagination_1.getPaginationParams)(req);
            try {
                const result = await this.accountService.getAgents(startIndex, endIndex);
                if (result) {
                    api_response_1.ApiResponse.success({
                        res,
                        req,
                        data: result,
                        message: `All Avalable Accounts Retrived`, // Include pagination metadata
                        metadata: paginationMetadata,
                    });
                }
                else {
                    throw httpException_1.HttpException.NotFound(`Account not found`);
                }
            }
            catch (error) {
                if (error instanceof httpException_1.HttpException) {
                    throw error;
                }
                throw httpException_1.HttpException.InternalServerError(`Something Went Wrong`, error);
            }
        };
        this.getAllTransporters = async (req, res) => {
            const { startIndex, endIndex, paginationMetadata } = (0, pagination_1.getPaginationParams)(req);
            try {
                const result = await this.accountService.getTransporters(startIndex, endIndex);
                if (result) {
                    api_response_1.ApiResponse.success({
                        res,
                        req,
                        data: result,
                        message: `All Avalable Accounts Retrived`, // Include pagination metadata
                        metadata: paginationMetadata,
                    });
                }
                else {
                    throw httpException_1.HttpException.NotFound(`Account not found`);
                }
            }
            catch (error) {
                if (error instanceof httpException_1.HttpException) {
                    throw error;
                }
                throw httpException_1.HttpException.InternalServerError(`Something Went Wrong`, error);
            }
        };
        this.getAccountById = async (req, res) => {
            const { paginationMetadata } = (0, pagination_1.getPaginationParams)(req);
            const accountId = parseInt(req.params.id);
            try {
                const result = await this.accountService.getAccountById(accountId);
                if (result) {
                    api_response_1.ApiResponse.success({
                        res,
                        req,
                        data: result,
                        message: `Account retrived for id ${accountId}`, // Include pagination metadata
                    });
                }
                else {
                    throw httpException_1.HttpException.NotFound(`Account not found`);
                }
            }
            catch (error) {
                if (error instanceof httpException_1.HttpException) {
                    throw error;
                }
                throw httpException_1.HttpException.InternalServerError(`Something Went Wrong`, error);
            }
        };
        // public getCustomerById = async (req: Request, res: Response): Promise<void> => {
        //     const page = parseInt(req.query.page as string) || 1;
        //     const limit = parseInt(req.query.limit as string) || 100;
        //     const startIndex:number = (page - 1) * limit;
        //     const endIndex: number = page * limit;
        //     const accountId = parseInt(req.params.id as string)
        //     try {
        //         const result = await this.accountService.getCustomerById(accountId)
        //         if (result) {
        //             ApiResponse.success({
        //                 res,
        //                 data: result,
        //                 message:`Account retrived for id ${accountId}`,// Include pagination metadata
        //             });
        //         } else {
        //             throw HttpException.NotFound(`Account not found`);
        //         }
        //     } catch (error) {
        //         throw HttpException.InternalServerError(`Something Went Wrong`, error);
        //     }
        // }
        this.getCustomerByGST = async (req, res) => {
            const { paginationMetadata } = (0, pagination_1.getPaginationParams)(req);
            const gst = req.params.gst;
            try {
                const result = await this.accountService.getCustomerByGST(gst);
                if (result) {
                    api_response_1.ApiResponse.success({
                        res,
                        req,
                        data: result,
                        message: `Account retrived for gst id ${gst}`, // Include pagination metadata
                    });
                }
                else {
                    throw httpException_1.HttpException.NotFound(`Account not found`);
                }
            }
            catch (error) {
                if (error instanceof httpException_1.HttpException) {
                    throw error;
                }
                throw httpException_1.HttpException.InternalServerError(`Something Went Wrong`, error);
            }
        };
        this.getAgentWithCustomers = async (req, res) => {
            const { paginationMetadata } = (0, pagination_1.getPaginationParams)(req);
            const agentId = parseInt(req.params.id);
            try {
                const result = await this.accountService.getAgentByIdWithCustomers(agentId);
                if (result) {
                    api_response_1.ApiResponse.success({
                        res,
                        req,
                        data: result,
                        message: `Account retrived for id ${agentId}`, // Include pagination metadata
                    });
                }
                else {
                    throw httpException_1.HttpException.NotFound(`Account not found`);
                }
            }
            catch (error) {
                if (error instanceof httpException_1.HttpException) {
                    throw error;
                }
                throw httpException_1.HttpException.InternalServerError(`Something Went Wrong`, error);
            }
        };
        this.accountService = accountService;
    }
};
exports.AccountController = AccountController;
exports.AccountController = AccountController = __decorate([
    stringDecorators_1.stringDecorators,
    __metadata("design:paramtypes", [account_service_1.AccountService])
], AccountController);
