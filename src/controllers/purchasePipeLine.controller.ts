//src/controllers/purchasePipeLine.controller.ts

import { Request, Response } from 'express';
import { objectDecorators } from '../decorators/objectDecorators'; // Assuming this is used for trimWhitespace etc.
import { SpTblFinishInWardOutWard } from '../entity/anushreeDb/spTblFinishInWardOutWard.entity';
import { PurchasePipeLine as PurchasePipeLineEntity } from '../entity/phoenixDb/purchasePipeLine.entity'; // Alias the entity
import { HttpException } from '../exceptions/httpException';
import { PurchaseParcelStatusService } from '../services/PurchaseInwardOutWard.service'; // This service now handles both providers
import { EqualFilter, Filters, LikeFilter } from '../types/filter.types'; // Import filter types
import { ApiResponse } from '../utils/api-response';

// Declaration merging for any methods added by decorators (e.g., trimWhitespace)
export interface PurchasePipeLineController {
    // If your @objectDecorators adds methods like `trimWhitespace` to controllers
    // then you might declare it here, though it's less common for controllers to have data transformation methods.
    // If it's not adding methods to the controller, this interface might not be strictly necessary.
    // Assuming `trimWhitespace` is primarily on providers/services.
}

import { inject, injectable } from "tsyringe";

@objectDecorators // If this decorator adds functionality directly to the controller instance
@injectable()
export class PurchasePipeLineController {
    private purchaseParcelStatusService: PurchaseParcelStatusService;

    constructor(@inject(PurchaseParcelStatusService) purchaseParcelStatusService: PurchaseParcelStatusService) {
        this.purchaseParcelStatusService = purchaseParcelStatusService;
        // Initialize the service's repositories. Call this once, perhaps in your main app bootstrap,
        // or ensure it's called upon service instantiation in registerDependencies.
        // For a controller, it's generally not responsible for initializing services.
        // The container should handle service instantiation and initialization if needed.
        // For now, I'll remove it from the constructor, assuming Tsyring or app bootstrap handles it.
        // If you MUST call it here, ensure it's awaited and handled gracefully.
        // This.purchaseParcelStatusService.initialize(); // This should ideally be awaited or managed differently
    }

    // --- 1. Get All Entries with Filters (similar to getIrnSeries but for the joined view) ---
    public getEntriesByFilter = async (req: Request, res: Response): Promise<void> => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const offset = (page - 1) * limit; // Renamed startIndex to offset for consistency with TypeORM skip/take

        // You'll need to define the relevant query parameters for filtering your joined view
        // Based on the SQL: Select T.purtrnid,T.Type,T.Vno,T.Dat,T.BillNo,T.Pcs, T.Customer,T.City,T.GroupName, T.AgentName, T.BillAmt,
        // isnull(D.LrNo,T.LRNo) LrNo,D.LrDat,D.ReceiveDate RecDat,D.Opendate OpnDat,T.Company from SpTblFinishInWardOutWard T
        // left join pheonixDB.dbo.PurchasePipeLine D on T.Purtrnid =d.Purtrnid and T.Type =d.Type
        // where".$condition." and T.TrnOrigin = 'frmFinPurchEntry' and T.Dat >= '20210801' order by T.vno, T.dat asc

        // Example query params for this specific controller:
        const { customer, company, startDate, endDate, billNo, trnOrigin } = req.query as {
            customer?: string;
            company?: string;
            startDate?: string; // YYYY-MM-DD
            endDate?: string;   // YYYY-MM-DD
            billNo?: string;
            trnOrigin?: string;
        };

        const filters: Filters<SpTblFinishInWardOutWard> = {}; // Filters for SpTblFinishInWardOutWard (T)

        if (customer) {
            filters.Customer = { like: `%${customer}%` } as LikeFilter<string>;
        }
        if (company) {
            filters.Company = { like: `%${company}%` } as LikeFilter<string>;
        }
        if (billNo) {
            filters.BillNo = { equal: billNo } as EqualFilter<string>;
        }

        // Apply date range filters if provided
        // Note: Your SQL hardcoded '20210801'. If you want to make it dynamic via query params, implement this.
        // The service layer `getEntriesByFilter` already has a hardcoded `T.Dat >= '2021-08-01'` and `T.TrnOrigin = 'frmFinPurchEntry'`.
        // If you want to override/extend those from the controller, you'll need to modify the service's filter application.
        // For now, I'll add them here and assume the service combines them appropriately.
        // If `startDate` and `endDate` are for the `Dat` column in `SpTblFinishInWardOutWard` (T):
        if (startDate) {
            // Assuming your `Filters` type supports `gte` (greater than or equal to)
            // If not, you'd extend your `Filter` types or use raw query conditions.
            // For example:
            // filters.Dat = { greaterThanOrEqual: new Date(startDate) };
            // For now, I'll stick to simple equal/like for common types, and let complex date ranges
            // be handled by direct query builder methods in the provider if `applyFilters` doesn't support it.
            // Or you'd add a `range` filter type.
        }
        if (endDate) {
            // filters.Dat = { lessThanOrEqual: new Date(endDate) };
        }

        // Apply mandatory conditions from the original SQL if not handled by `applyFilters` utility
        filters.TrnOrigin = { equal: trnOrigin || 'frmFinPurchEntry' } as EqualFilter<string>;
        // Date filter from SQL (SpTblFinishInWardOutWard.Dat >= '20210801')
        // This is tricky with `applyFilters` if it doesn't support ranges on dates.
        // If `applyFilters` can't handle it, you'd manually add:
        // filters.Dat = { greaterThanOrEqual: new Date('2021-08-01') } as any; // Cast as any if filter type doesn't have it

        try {
            const result = await this.purchaseParcelStatusService.getEntriesByFilter(company!, startDate!, endDate!, customer!, filters, offset, limit);

            if (result && result.length > 0) {
                ApiResponse.success({
                    res,
                    req,
                    data: result,
                    message: `Purchase pipeline entries retrieved successfully`
                });
            } else {
                throw HttpException.NotFound(`No purchase pipeline entries found matching criteria.`);
            }
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw HttpException.InternalServerError(`Something Went Wrong while fetching purchase pipeline entries`, error);
        }
    };

    // --- 2. Get Single Entry by ID (for PurchasePipeLine entity) ---
    public getEntryById = async (req: Request, res: Response): Promise<void> => {
        // The service's GetEntrybyId uses Purtrnid and Type as composite keys.
        // Ensure these are provided as route parameters or query parameters.
        const purTrnId = parseInt(req.params.purTrnId as string); // Assuming route param like /:purTrnId/:type
        const { customer, company, startDate, endDate } = req.query as {
            customer?: string;
            company?: string;
            startDate?: string; // YYYY-MM-DD
            endDate?: string;   // YYYY-MM-DD
        };
        if (isNaN(purTrnId)) {
            throw HttpException.BadRequest('Invalid PurTrnId or Type provided.');
        }

        try {
            const result = await this.purchaseParcelStatusService.GetEntrybyId(company!, startDate!, endDate!, customer!, purTrnId);

            if (result) {
                ApiResponse.success({
                    res,
                    req,
                    data: result,
                    message: `Purchase pipeline entry retrieved for PurTrnId: ${purTrnId}`
                });
            } else {
                throw HttpException.NotFound(`Purchase pipeline entry not found for PurTrnId: ${purTrnId}.`);
            }
        } catch (error) {
            throw HttpException.InternalServerError(`Something Went Wrong while fetching purchase pipeline entry`, error);
        }
    };

    // --- 3. Insert New Entry (for PurchasePipeLine entity) ---
    public insertEntry = async (req: Request, res: Response): Promise<void> => {
        const entryData: Partial<PurchasePipeLineEntity> = req.body;

        // Basic validation (add more as per your entity's required fields)
        if (!entryData.Purtrnid || !entryData.Type || !entryData.Vno || !entryData.Dat) {
            throw HttpException.BadRequest('Missing required fields for new entry (Purtrnid, Type, Vno, Dat).');
        }

        try {
            const newEntry = await this.purchaseParcelStatusService.InsetEntry(entryData);

            if (newEntry) {
                ApiResponse.success({
                    res,
                    req,
                    data: newEntry,
                    message: `Purchase pipeline entry created successfully`,
                    statusCode: 201 // 201 Created
                });
            } else {
                // This case should ideally not be reached if InsetEntry returns the entity on success
                throw HttpException.InternalServerError('Failed to create purchase pipeline entry.');
            }
        } catch (error) {
            throw HttpException.InternalServerError(`Something Went Wrong while inserting purchase pipeline entry`, error);
        }
    };

    // --- 4. Update Existing Entry (for PurchasePipeLine entity) ---
    public updateEntry = async (req: Request, res: Response): Promise<void> => {
        // As with getEntryById, assume Purtrnid and Type are composite keys for update lookup
        const purTrnId = parseInt(req.params.purTrnId as string); // Assuming route param like /:purTrnId/:type
        const updateData: Partial<PurchasePipeLineEntity> = req.body;

        if (isNaN(purTrnId)) {
            throw HttpException.BadRequest('Invalid PurTrnId or Type provided for update.');
        }
        if (Object.keys(updateData).length === 0) {
            throw HttpException.BadRequest('No update data provided.');
        }

        try {
            const success = await this.purchaseParcelStatusService.UpdateEntry(purTrnId, updateData);

            if (success) {
                ApiResponse.success({
                    res,
                    req,
                    data: { updated: true }, // Or fetch the updated record if you want to return it
                    message: `Purchase pipeline entry updated for PurTrnId: ${purTrnId}`
                });
            } else {
                throw HttpException.NotFound(`Purchase pipeline entry not found for update with PurTrnId: ${purTrnId}, or no changes made.`);
            }
        } catch (error) {
            throw HttpException.InternalServerError(`Something Went Wrong while updating purchase pipeline entry`, error);
        }
    };

    // If @objectDecorators provides trimWhitespace, include it here if the controller needs it.
    // However, usually, data transformation happens in services or providers.
    // trimWhitespace<T>(obj: T): T {
    //     // This would be provided by the decorator
    //     return obj;
    // }
}
