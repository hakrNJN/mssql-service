"use strict";
//src/controllers/KotakCMS.controller.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.KotakCMSController = void 0;
const tsyringe_1 = require("tsyringe");
const httpException_1 = require("../exceptions/httpException");
const api_response_1 = require("../utils/api-response");
const logger_1 = require("../utils/logger");
// No need for filter types or Vwkotakcmsonline entity import here, as it's handled by service/provider
// If Vwkotakcmsonline is needed for response typing, keep it. I'll keep it for clarity.
class KotakCMSController {
    constructor(kotakCMSService) {
        // Method to get all Kotak CMS records with filters
        this.getAllKotakCMS = async (req, res) => {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;
            const { fromVno, toVno, // Required for vno range
            conum, // Required Company Number
            yearid // Required Year ID
             } = req.query;
            // Validate required parameters
            if (!fromVno || !toVno || !conum || !yearid) {
                throw httpException_1.HttpException.BadRequest('Missing required query parameters: fromVno, toVno, conum, yearid.');
            }
            const parsedFromVno = parseInt(fromVno);
            const parsedToVno = parseInt(toVno);
            const parsedConum = conum; // Conum is already string, just for clarity
            const parsedYearId = parseInt(yearid);
            if (isNaN(parsedFromVno) || isNaN(parsedToVno)) {
                throw httpException_1.HttpException.BadRequest('Invalid Vno range provided. Both fromVno and toVno must be valid numbers.');
            }
            if (isNaN(parsedYearId)) {
                throw httpException_1.HttpException.BadRequest('Invalid yearid provided. Must be a valid number.');
            }
            try {
                // Call the correct method on the service with the extracted parameters
                const result = await this.kotakCMSService.getKotakCMSData(parsedFromVno, parsedToVno, parsedConum, parsedYearId, offset, limit);
                if (result && result.length > 0) {
                    api_response_1.ApiResponse.success({
                        res,
                        req,
                        data: result,
                        message: `Kotak CMS records retrieved successfully`
                    });
                }
                else {
                    throw httpException_1.HttpException.NotFound(`No Kotak CMS records found matching criteria.`);
                }
            }
            catch (error) {
                this.logger.error("Error in getAllKotakCMS:", error);
                if (error instanceof httpException_1.HttpException) {
                    throw error;
                }
                else {
                    throw httpException_1.HttpException.InternalServerError(`Something Went Wrong while fetching Kotak CMS records`, error);
                }
            }
        };
        this.kotakCMSService = kotakCMSService;
        this.logger = tsyringe_1.container.resolve(logger_1.WINSTON_LOGGER);
    }
}
exports.KotakCMSController = KotakCMSController;
