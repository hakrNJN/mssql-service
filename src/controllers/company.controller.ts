//src/controllers/company.controller.ts
import { Request, Response } from 'express';
import { CompMst } from '../entity/anushreeDb/company.entity';
import { HttpException } from '../exceptions/httpException';
import { CompanyService } from '../services/company.service';
import { EqualFilter, Filters } from '../types/filter.types';
import { ApiResponse } from '../utils/api-response';

import { inject, injectable } from "tsyringe";

@injectable()
export class CompanyController {

    private companyService: CompanyService;

    constructor(@inject(CompanyService) companyService: CompanyService) {
        this.companyService = companyService;
    }

    public getCompanies = async (req: Request, res: Response): Promise<void> => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        try {
            const result = await this.companyService.getCompanies()
            if (result) {
                ApiResponse.success({
                    res,
                    req,
                    data: result,
                    message: `All Available Company Retrieved`// Include pagination metadata
                });
            } else {
                throw HttpException.NotFound(`Companies not found`);
            }
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw HttpException.InternalServerError(`Something Went Wrong`, error);
        }

    }

    public getCompanyById = async (req: Request, res: Response): Promise<void> => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const comapnyId = parseInt(req.params.id as string)
        try {
            const result = await this.companyService.getCompanyById(comapnyId)
            if (result) {
                ApiResponse.success({
                    res,
                    req,
                    data: result,
                    message: `Company retrieved for id ${comapnyId}`// Include pagination metadata
                });
            } else {
                throw HttpException.NotFound(`Company not found`);
            }
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw HttpException.InternalServerError(`Something Went Wrong`, error);
        }
    }

    public getCompanyByGSTIN = async (req: Request, res: Response): Promise<void> => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const GSTIN = req.params.gstin as string

        const filters: Filters<CompMst> = {
            GST: { equal: GSTIN } as EqualFilter<string>
        }

        try {
            const result = await this.companyService.getCompaniesWithFilters(filters)
            if (result) {
                ApiResponse.success({
                    res,
                    req,
                    data: result,
                    message: `Company retrieved for GSTIN ${GSTIN}`// Include pagination metadata
                });
            } else {
                throw HttpException.NotFound(`Company not found`);
            }
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw HttpException.InternalServerError(`Something Went Wrong`, error);
        }
    }
}