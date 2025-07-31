"use strict";
//src/controllers/purchasePipeLine.controller.ts
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
exports.PurchasePipeLineController = void 0;
const objectDecorators_1 = require("../decorators/objectDecorators"); // Assuming this is used for trimWhitespace etc.
const httpException_1 = require("../exceptions/httpException");
const purchaseInwardOutWard_service_1 = require("../services/purchaseInwardOutWard.service"); // This service now handles both providers
const api_response_1 = require("../utils/api-response");
let PurchasePipeLineController = class PurchasePipeLineController {
    constructor(purchaseParcelStatusService) {
        // --- 1. Get All Entries with Filters (similar to getIrnSeries but for the joined view) ---
        this.getEntriesByFilter = async (req, res) => {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit; // Renamed startIndex to offset for consistency with TypeORM skip/take
            // You'll need to define the relevant query parameters for filtering your joined view
            // Based on the SQL: Select T.purtrnid,T.Type,T.Vno,T.Dat,T.BillNo,T.Pcs, T.Customer,T.City,T.GroupName, T.AgentName, T.BillAmt,
            // isnull(D.LrNo,T.LRNo) LrNo,D.LrDat,D.ReceiveDate RecDat,D.Opendate OpnDat,T.Company from SpTblFinishInWardOutWard T
            // left join pheonixDB.dbo.PurchasePipeLine D on T.Purtrnid =d.Purtrnid and T.Type =d.Type
            // where".$condition." and T.TrnOrigin = 'frmFinPurchEntry' and T.Dat >= '20210801' order by T.vno, T.dat asc
            // Example query params for this specific controller:
            const { customer, company, startDate, endDate, billNo, trnOrigin } = req.query;
            const filters = {}; // Filters for SpTblFinishInWardOutWard (T)
            if (customer) {
                filters.Customer = { like: `%${customer}%` };
            }
            if (company) {
                filters.Company = { like: `%${company}%` };
            }
            if (billNo) {
                filters.BillNo = { equal: billNo };
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
            filters.TrnOrigin = { equal: trnOrigin || 'frmFinPurchEntry' };
            // Date filter from SQL (SpTblFinishInWardOutWard.Dat >= '20210801')
            // This is tricky with `applyFilters` if it doesn't support ranges on dates.
            // If `applyFilters` can't handle it, you'd manually add:
            // filters.Dat = { greaterThanOrEqual: new Date('2021-08-01') } as any; // Cast as any if filter type doesn't have it
            try {
                const result = await this.purchaseParcelStatusService.getEntriesByFilter(company, startDate, endDate, customer, filters, offset, limit);
                if (result && result.length > 0) {
                    api_response_1.ApiResponse.success({
                        res,
                        req,
                        data: result,
                        message: `Purchase pipeline entries retrieved successfully`
                    });
                }
                else {
                    throw httpException_1.HttpException.NotFound(`No purchase pipeline entries found matching criteria.`);
                }
            }
            catch (error) {
                if (error instanceof httpException_1.HttpException) {
                    throw error;
                }
                throw httpException_1.HttpException.InternalServerError(`Something Went Wrong while fetching purchase pipeline entries`, error);
            }
        };
        // --- 2. Get Single Entry by ID (for PurchasePipeLine entity) ---
        this.getEntryById = async (req, res) => {
            // The service's GetEntrybyId uses Purtrnid and Type as composite keys.
            // Ensure these are provided as route parameters or query parameters.
            const purTrnId = parseInt(req.params.purTrnId); // Assuming route param like /:purTrnId/:type
            const { customer, company, startDate, endDate } = req.query;
            if (isNaN(purTrnId)) {
                throw httpException_1.HttpException.BadRequest('Invalid PurTrnId or Type provided.');
            }
            try {
                const result = await this.purchaseParcelStatusService.GetEntrybyId(company, startDate, endDate, customer, purTrnId);
                if (result) {
                    api_response_1.ApiResponse.success({
                        res,
                        req,
                        data: result,
                        message: `Purchase pipeline entry retrieved for PurTrnId: ${purTrnId}`
                    });
                }
                else {
                    throw httpException_1.HttpException.NotFound(`Purchase pipeline entry not found for PurTrnId: ${purTrnId}.`);
                }
            }
            catch (error) {
                throw httpException_1.HttpException.InternalServerError(`Something Went Wrong while fetching purchase pipeline entry`, error);
            }
        };
        // --- 3. Insert New Entry (for PurchasePipeLine entity) ---
        this.insertEntry = async (req, res) => {
            const entryData = req.body;
            // Basic validation (add more as per your entity's required fields)
            if (!entryData.Purtrnid || !entryData.Type || !entryData.Vno || !entryData.Dat) {
                throw httpException_1.HttpException.BadRequest('Missing required fields for new entry (Purtrnid, Type, Vno, Dat).');
            }
            try {
                const newEntry = await this.purchaseParcelStatusService.InsetEntry(entryData);
                if (newEntry) {
                    api_response_1.ApiResponse.success({
                        res,
                        req,
                        data: newEntry,
                        message: `Purchase pipeline entry created successfully`,
                        statusCode: 201 // 201 Created
                    });
                }
                else {
                    // This case should ideally not be reached if InsetEntry returns the entity on success
                    throw httpException_1.HttpException.InternalServerError('Failed to create purchase pipeline entry.');
                }
            }
            catch (error) {
                throw httpException_1.HttpException.InternalServerError(`Something Went Wrong while inserting purchase pipeline entry`, error);
            }
        };
        // --- 4. Update Existing Entry (for PurchasePipeLine entity) ---
        this.updateEntry = async (req, res) => {
            // As with getEntryById, assume Purtrnid and Type are composite keys for update lookup
            const purTrnId = parseInt(req.params.purTrnId); // Assuming route param like /:purTrnId/:type
            const updateData = req.body;
            if (isNaN(purTrnId)) {
                throw httpException_1.HttpException.BadRequest('Invalid PurTrnId or Type provided for update.');
            }
            if (Object.keys(updateData).length === 0) {
                throw httpException_1.HttpException.BadRequest('No update data provided.');
            }
            try {
                const success = await this.purchaseParcelStatusService.UpdateEntry(purTrnId, updateData);
                if (success) {
                    api_response_1.ApiResponse.success({
                        res,
                        req,
                        data: { updated: true }, // Or fetch the updated record if you want to return it
                        message: `Purchase pipeline entry updated for PurTrnId: ${purTrnId}`
                    });
                }
                else {
                    throw httpException_1.HttpException.NotFound(`Purchase pipeline entry not found for update with PurTrnId: ${purTrnId}, or no changes made.`);
                }
            }
            catch (error) {
                throw httpException_1.HttpException.InternalServerError(`Something Went Wrong while updating purchase pipeline entry`, error);
            }
        };
        this.purchaseParcelStatusService = purchaseParcelStatusService;
        // Initialize the service's repositories. Call this once, perhaps in your main app bootstrap,
        // or ensure it's called upon service instantiation in registerDependencies.
        // For a controller, it's generally not responsible for initializing services.
        // The container should handle service instantiation and initialization if needed.
        // If it's critical for every request, consider an express middleware for initialization.
        // For now, I'll remove it from the constructor, assuming Tsyring or app bootstrap handles it.
        // If you MUST call it here, ensure it's awaited and handled gracefully.
        // This.purchaseParcelStatusService.initialize(); // This should ideally be awaited or managed differently
    }
};
exports.PurchasePipeLineController = PurchasePipeLineController;
exports.PurchasePipeLineController = PurchasePipeLineController = __decorate([
    objectDecorators_1.objectDecorators // If this decorator adds functionality directly to the controller instance
    ,
    __metadata("design:paramtypes", [purchaseInwardOutWard_service_1.PurchaseParcelStatusService])
], PurchasePipeLineController);
