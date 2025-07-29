//src/controllers/KotakCMS.controller.ts

import { Request, Response } from 'express';
import { HttpException } from '../exceptions/httpException';
import { KotakCMSService } from '../services/KotakCMS.Service'; // Correct import
import { ApiResponse } from '../utils/api-response';
// No need for filter types or Vwkotakcmsonline entity import here, as it's handled by service/provider
// If Vwkotakcmsonline is needed for response typing, keep it. I'll keep it for clarity.

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
            fromVno, toVno, // Required for vno range
            conum,         // Required Company Number
            yearid         // Required Year ID
        } = req.query as {
            fromVno?: string;
            toVno?: string;
            conum?: string;
            yearid?: string;
        };

        // Validate required parameters
        if (!fromVno || !toVno || !conum || !yearid) {
            throw HttpException.BadRequest('Missing required query parameters: fromVno, toVno, conum, yearid.');
        }

        const parsedFromVno = parseInt(fromVno);
        const parsedToVno = parseInt(toVno);
        const parsedConum = conum; // Conum is already string, just for clarity
        const parsedYearId = parseInt(yearid);

        if (isNaN(parsedFromVno) || isNaN(parsedToVno)) {
            throw HttpException.BadRequest('Invalid Vno range provided. Both fromVno and toVno must be valid numbers.');
        }
        if (isNaN(parsedYearId)) {
            throw HttpException.BadRequest('Invalid yearid provided. Must be a valid number.');
        }

        try {
            // Call the correct method on the service with the extracted parameters
            const result = await this.kotakCMSService.getKotakCMSData(
                parsedFromVno,
                parsedToVno,
                parsedConum,
                parsedYearId,
                offset,
                limit
            );

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
            if (error instanceof HttpException) {
                throw error;
            } else {
                throw HttpException.InternalServerError(`Something Went Wrong while fetching Kotak CMS records`, error);
            }
        }
    };

    // getKotakCMSById method remains removed.
}