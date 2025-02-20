//src/controllers/series.controller.ts

import { Request, Response } from 'express'
import { AppConfig } from '../config/config'
import { stringDecorators } from '../decorators/stringDecorators'
import { SerMst } from '../entity/anushree/series.entity'
import { HttpException } from '../exceptions/httpException'
import { SeriesService } from '../services/series.service'
import { EqualFilter, EqualNullFilter, Filters, InFilter, LikeFilter, NotLikeFilter } from '../types/filter.types'
import { ApiResponse } from '../utils/api-response'

// Declaration merging to inform TypeScript about the added method
export interface SeriesController {
    stringToArray(str: string): number[];
}

@stringDecorators
export class SeriesController {
    private seriesService: SeriesService;
    constructor(seriesService: SeriesService) {
        this.seriesService = seriesService;
        this.seriesService.initialize()
    }

    public getAllSeries = async (req: Request, res: Response): Promise<void> => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        try {
            const result = await this.seriesService.getAllSeries()
            if (result) {
                ApiResponse.success({
                    res,
                    req,
                    data: result,
                    message: `All Avalable Series Retrived`// Include pagination metadata
                });
            } else {
                throw HttpException.NotFound(`Series not found`);
            }
        } catch (error) {
            throw HttpException.InternalServerError(`Something Went Wrong`, error);
        }
    }

    public getSeriesById = async (req: Request, res: Response): Promise<void> => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const seriesId = parseInt(req.params.id as string)

        try {
            const result = await this.seriesService.getSeriesbyId(seriesId)
            if (result) {
                ApiResponse.success({
                    res,
                    req,
                    data: result,
                    message: `Series retrived for id ${seriesId}`// Include pagination metadata
                });
            } else {
                throw HttpException.NotFound(`Series not found`);
            }
        } catch (error) {
            throw HttpException.InternalServerError(`Something Went Wrong`, error);
        }
    }

    public getIrnSeries = async (req: Request, res: Response): Promise<void> => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        //getting required query params
        const { yearid, type, company } = req.query as { yearid: string, type: string, company: string };
        
        //checking if required query params are present or not, and if not throw error
        if (!company) {
            throw HttpException.BadRequest(`Company is required`);
        }
        if (!type) {
            throw HttpException.BadRequest(`tyoe is required`);
        }
        if (!yearid) {
            throw HttpException.BadRequest(`yearId is required`);
        }

        //splitting company string into array
        const comp :number[] =  this.stringToArray(company)//company!.split(',');

        //checking if type is D or C and setting typeCondition accordingly
        const typeCondition:string[] = (type!.toLowerCase() === 'd') ? ["sale", "dr note"] : ["sale return", "cr note"];

        //creating and empty array for orConditions For AllowedCompany
        const orConditionsForCompany: Filters<SerMst>[] = [];

        //checking if company array is empty or not, if not then modifying orConditionsForCompany array
        if (comp && comp.length > 0) { 
            comp.forEach(singleComp => {
                orConditionsForCompany.push({
                    AllowComp: { like: `%\\${singleComp}\\%` } as LikeFilter<string | null>
                });
                orConditionsForCompany.push({
                    AllowComp: { equalNull: true } as EqualNullFilter
                });
                orConditionsForCompany.push({
                    AllowComp: { equal: "\\" }  as EqualFilter<string | undefined> 
                });
            });
        } else {
            //although this condition is not required as we are already checking if company is present or not, but still added for safety
            orConditionsForCompany.push({
                AllowComp: { equalNull: true }
            });
            orConditionsForCompany.push({
                AllowComp: { equal: "\\" } 
            });
        }

        //getting allowed forms for sale series
        const allowedForms = AppConfig.allowedFormsForSaleSeries.map((form) => `/${form}/`);

        //now creating the actual filters object from the above conditions
        const filters: Filters<SerMst> = {
            YearId: { equal: parseInt(yearid as string) }  as EqualFilter<number>,
            Type: { in: typeCondition }as InFilter<string>,
            Name: { notLike: 'Supplier%' }as NotLikeFilter<string>, 
            or: orConditionsForCompany, 
            Status: { equal: 'T' }  as EqualFilter<string>, 
            AcEffect: { equal: true } as EqualFilter<boolean>,
            Allow_form:{in:allowedForms} as InFilter<string>
        };

        
        try {
            const result = await this.seriesService.getSeriesWithFilters(filters)
            if (result) {
                ApiResponse.success({
                    res,
                    req,
                    data: result,
                    message: `IRN Series retrived`// Include pagination metadata
                });
            } else {
                throw HttpException.NotFound(`Series not found`);
            }
        } catch (error) {
            throw HttpException.InternalServerError(`Something Went Wrong`, error);
        }
    }


    // private createTypeOrmFiltersForCompany = (yearid: string, type: string, comp: string | undefined): Filters<SerMst> => {
    //     const company = comp ? comp.split(',') : []; // Split comma-separated string into array, handle undefined comp

    //     const typeCondition = (type === 'D') ? ["sale", "dr note"] : ["sale return", "cr note"];

    //     const orConditionsForCompany: Filters<SerMst>[] = [];
    //     if (company && company.length > 0) {
    //         company.forEach(singleComp => {
    //             orConditionsForCompany.push({
    //                 AllowComp: { like: `%\\${singleComp}\\%` } as LikeFilter<string | null> // Explicitly cast to LikeFilter
    //             });
    //             orConditionsForCompany.push({
    //                 AllowComp: { equalNull: true } as EqualNullFilter // Explicitly cast to EqualNullFilter
    //             });
    //             orConditionsForCompany.push({
    //                 AllowComp: { equal: "\\" } as EqualFilter<string | undefined> // Explicitly cast to EqualFilter
    //             });
    //         });
    //     } else {
    //         // If company array is empty or undefined, apply default OR conditions (like Sequelize behavior)
    //         orConditionsForCompany.push({
    //             AllowComp: { equalNull: true } as EqualNullFilter
    //         });
    //         orConditionsForCompany.push({
    //             AllowComp: { equal: "\\" } as EqualFilter<string | null>
    //         });
    //     }


    //     const filters: Filters<SerMst> = {
    //         YearId: { equal: parseInt(yearid as string) } as EqualFilter<number>,
    //         Type: { in: typeCondition } as InFilter<string>,
    //         Name: { notLike: 'Supplier%' } as NotLikeFilter<string>, // Added NotLike for Name
    //         or: orConditionsForCompany, // Add the array of OR conditions
    //         Status: { equal: 'T' } as EqualFilter<string>, // Assuming you want to keep Status: 'T'
    //         AcEffect: { equal: 1 } as EqualFilter<number> // Assuming you want to keep AcEffect: 1
    //         // Allow_form:  ... you would add Allow_form filter here if needed, similar to Type or YearId
    //     };

    //     return filters;
    // };
}