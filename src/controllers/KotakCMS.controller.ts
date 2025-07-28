//src/controllers/KotakCMS.controller.ts

import { Request, Response } from 'express';
import { HttpException } from '../exceptions/httpException';
import { KotakCMSService } from '../services/KotakCMS.Service';
import { Filters, BetweenDateFilter, BetweenRangeFilter, EqualFilter } from '../types/filter.types'; // Import EqualFilter
import { ApiResponse } from '../utils/api-response';
import { Vwkotakcmsonline }
 from '../entity/anushree/KotakCMS.entity';

export class KotakCMSController {
    private kotakCMSService: KotakCMSService;

    constructor(kotakCMSService: KotakCMSService) {
        this.kotakCMSService = kotakCMSService;
    }

    // Method to get all Kotak CMS records with filters
    public getAllKotakCMS = async (req: Request, res: Response): Promise<void> => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const offset = (page - 1) * limit;

        const {
            fromDate, toDate, // For Payment_Date range
            fromVno, toVno,  // For vno range
            Conum, Yearid    // New mandatory parameters
        } = req.query as {
            fromDate?: string;
            toDate?: string;
            fromVno?: string;
            toVno?: string;
            Conum?: string;
            Yearid?: string;
        };

        // --- Validate mandatory parameters ---
        if (!Conum || !Yearid) {
            throw HttpException.BadRequest('Conum and Yearid are required.');
        }

        const filters: Filters<Vwkotakcmsonline> = {};
        const orConditions: Filters<Vwkotakcmsonline>[] = [];

        // --- Add Conum and Yearid to filters ---
        filters.Client_Code = { equal: Conum } as EqualFilter<string>; // Assuming Conum maps to Client_Code
        filters.Yearid = { equal: parseInt(Yearid) } as EqualFilter<number>; // Assuming Yearid maps to Yearid (if it exists in entity) or some other column.
                                                                           // Note: Vwkotakcmsonline entity does *not* have a 'Yearid' column currently.
                                                                           // If it should be filtered by Yearid, you need to add it to Vwkotakcmsonline entity.
                                                                           // For now, I'll add it, but it will only work if the column exists in the view.
                                                                           // If Yearid is only for an SP, this approach is incorrect.

        // --- Date range filtering for Payment_Date ---
        if (fromDate && toDate) {
            orConditions.push({
                Payment_Date: {
                    betweenDate: [new Date(fromDate), new Date(toDate)]
                } as BetweenDateFilter
            });
        }

        // --- Vno range filtering ---
        if (fromVno && toVno) {
            const parsedFromVno = parseInt(fromVno);
            const parsedToVno = parseInt(toVno);

            if (!isNaN(parsedFromVno) && !isNaN(parsedToVno)) {
                orConditions.push({
                    vno: {
                        betweenRange: [parsedFromVno, parsedToVno]
                    } as BetweenRangeFilter
                });
            } else {
                throw HttpException.BadRequest('Invalid Vno range provided. Both fromVno and toVno must be valid numbers.');
            }
        }

        // Apply filters only if either date range or vno range is provided
        // OR if Conum/Yearid are the *only* filters and no range is needed.
        // If Conum/Yearid are *always* present, then we don't need `orConditions.length > 0` to validate.
        // The check should be that *at least one* range is provided, IF Conum/Yearid alone are not enough.
        if (orConditions.length > 0) {
            // If ranges are provided, add them as an OR condition to the existing filters.
            // This means (Conum AND Yearid) AND (DateRange OR VnoRange)
            filters.or = orConditions; // This structure needs `applyFilters` to handle `or` at the top level properly
        } else {
            // If no range is provided, but Conum/Yearid are, proceed.
            // If ranges are mandatory even with Conum/Yearid, then throw error.
            // Based on your previous instruction "Please provide either a date range (fromDate, toDate) or a Vno range (fromVno, toVno).",
            // I will keep this validation strict, meaning a range is always expected in addition to Conum/Yearid.
            throw HttpException.BadRequest('Please provide either a date range (fromDate, toDate) or a Vno range (fromVno, toVno).');
        }

        try {
            const result = await this.kotakCMSService.getKotakCMSWithFilters(filters, offset, limit);

            if (result && result.length > 0) {
                ApiResponse.success({
                    res,
                    req,
                    data: result,
                    message: `Kotak CMS records retrieved successfully`
                });
            } else {
                throw HttpException.NotFound(`No Kotak CMS records found matching criteria.`);
            }
        } catch (error) {
            console.error("Error in getAllKotakCMS:", error);
            throw HttpException.InternalServerError(`Something Went Wrong while fetching Kotak CMS records`, error);
        }
    };
}