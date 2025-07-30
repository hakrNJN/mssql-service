//src/controllers/series.controller.ts

import { Request, Response } from 'express'
import { stringDecorators } from '../decorators/stringDecorators'
import { HttpException } from '../exceptions/httpException'
import { AccountService } from '../services/account.service'
import { ApiResponse } from '../utils/api-response'

// Declaration merging to inform TypeScript about the added method
export interface AccountController {
    stringToArray(str: string): number[];
}

@stringDecorators
export class AccountController {
    private accountService : AccountService;
    constructor(accountService: AccountService) {
        this.accountService = accountService;
        this.accountService.initialize()
    }

    public getAllAccounts = async (req: Request, res: Response): Promise<void> => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 100;
        const startIndex:number = (page - 1) * limit;
        const endIndex: number = page * limit;
        
        const paginationMetadata = {
            page: page,
            perPage: limit,
        };

        try {
            const result = await this.accountService.getAccounts(startIndex,endIndex)
            if (result) {
                ApiResponse.success({
                    res,
                    req,
                    data: result,
                    message: `All Avalable Accounts Retrived`,// Include pagination metadata
                    metadata:paginationMetadata,
                });
            } else {
                throw HttpException.NotFound(`Account not found`);
            }
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw HttpException.InternalServerError(`Something Went Wrong`, error);
        }
    }

    public getAllCustomers = async (req: Request, res: Response): Promise<void> => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 100;
        const startIndex:number = (page - 1) * limit;
        const endIndex: number = page * limit;
        
        const paginationMetadata = {
            page: page,
            perPage: limit,
        };

        try {
            const result = await this.accountService.getCustomers(startIndex,endIndex)
            if (result) {
                ApiResponse.success({
                    res,
                    req,
                    data: result,
                    message: `All Avalable Accounts Retrived`,// Include pagination metadata
                    metadata:paginationMetadata,
                });
            } else {
                throw HttpException.NotFound(`Account not found`);
            }
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw HttpException.InternalServerError(`Something Went Wrong`, error);
        }
    }

    public getAllAgents = async (req: Request, res: Response): Promise<void> => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 100;
        const startIndex:number = (page - 1) * limit;
        const endIndex: number = page * limit;
        
        const paginationMetadata = {
            page: page,
            perPage: limit,
        };

        try {
            const result = await this.accountService.getAgents(startIndex,endIndex)
            if (result) {
                ApiResponse.success({
                    res,
                    req,
                    data: result,
                    message: `All Avalable Accounts Retrived`,// Include pagination metadata
                    metadata:paginationMetadata,
                });
            } else {
                throw HttpException.NotFound(`Account not found`);
            }
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw HttpException.InternalServerError(`Something Went Wrong`, error);
        }
    }

    public getAllTransporters = async (req: Request, res: Response): Promise<void> => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 100;
        const startIndex:number = (page - 1) * limit;
        const endIndex: number = page * limit;
        
        const paginationMetadata = {
            page: page,
            perPage: limit,
        };

        try {
            const result = await this.accountService.getTransporters(startIndex,endIndex)
            if (result) {
                ApiResponse.success({
                    res,
                    req,
                    data: result,
                    message: `All Avalable Accounts Retrived`,// Include pagination metadata
                    metadata:paginationMetadata,
                });
            } else {
                throw HttpException.NotFound(`Account not found`);
            }
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw HttpException.InternalServerError(`Something Went Wrong`, error);
        }
    }

    public getAccountById = async (req: Request, res: Response): Promise<void> => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 100;
        const startIndex:number = (page - 1) * limit;
        const endIndex: number = page * limit;
        const accountId = parseInt(req.params.id as string)
        try {
            const result = await this.accountService.getAccountById(accountId)
            if (result) {
                ApiResponse.success({
                    res,
                    req,
                    data: result,
                    message:`Account retrived for id ${accountId}`,// Include pagination metadata
                });
            } else {
                throw HttpException.NotFound(`Account not found`);
            }
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw HttpException.InternalServerError(`Something Went Wrong`, error);
        }
    }

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

    public getCustomerByGST = async (req: Request, res: Response): Promise<void> => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 100;
        const startIndex:number = (page - 1) * limit;
        const endIndex: number = page * limit;
        const gst = req.params.gst as string
        try {
            const result = await this.accountService.getCustomerByGST(gst)
            if (result) {
                ApiResponse.success({
                    res,
                    req,
                    data: result,
                    message:`Account retrived for gst id ${gst}`,// Include pagination metadata
                });
            } else {
                throw HttpException.NotFound(`Account not found`);
            }
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw HttpException.InternalServerError(`Something Went Wrong`, error);
        }
    }

    public getAgentWithCustomers = async (req: Request, res: Response): Promise<void> => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 100;
        const startIndex:number = (page - 1) * limit;
        const endIndex: number = page * limit;
        const agentId = parseInt(req.params.id as string)
        try {
            const result = await this.accountService.getAgentByIdWithCustomers(agentId)
            if (result) {
                ApiResponse.success({
                    res,
                    req,
                    data: result,
                    message:`Account retrived for id ${agentId}`,// Include pagination metadata
                });
            } else {
                throw HttpException.NotFound(`Account not found`);
            }
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw HttpException.InternalServerError(`Something Went Wrong`, error);
        }
    }

}