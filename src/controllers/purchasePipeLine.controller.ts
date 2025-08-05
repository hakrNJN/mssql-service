// src/controllers/purchasePipeLine.controller.ts
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { PurchasePipeLine as PurchasePipeLineEntity } from "../entity/phoenixDb/purchasePipeLine.entity";
import { ILogger } from "../interface/logger.interface";
import { IGetPurchaseParcelStatusParams, IPurchaseParcelStatusService } from "../services/purchaseParcelStatus.service";
import { WINSTON_LOGGER } from "../utils/logger";

@injectable()
export class PurchasePipeLineController {
    constructor(
        @inject(WINSTON_LOGGER) private logger: ILogger,
        @inject("PurchaseParcelStatusService") private purchaseParcelStatusService: IPurchaseParcelStatusService
    ) { }

    public async getPurchaseParcelStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { conum, fdat, tdat, accountId, agentid } = req.query;
            const filters = req.body.filters as string[] | undefined; // Filters from request body

            if (!conum || !fdat || !tdat || !accountId) {
                res.status(400).json({ message: "Missing required query parameters: conum, fdat, tdat, accountId" });
                return;
            }

            const params: IGetPurchaseParcelStatusParams = {
                conum: conum as string,
                fdat: fdat as string,
                tdat: tdat as string,
                accountId: accountId as string,
                agentid: agentid ? (agentid as string).split(',') : undefined,
                filters: filters
            };

            const offset = req.query.offset ? parseInt(req.query.offset as string) : undefined;
            const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;

            const result = await this.purchaseParcelStatusService.getPurchaseParcelStatus(params, offset, limit);
            res.status(200).json(result);
        } catch (error) {
            this.logger.error(`Error in getPurchaseParcelStatus: ${error instanceof Error ? error.message : String(error)}`, error);
            next(error);
        }
    }

    public async createPurchasePipeLine(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data: Partial<PurchasePipeLineEntity> = req.body;
            const newRecord = await this.purchaseParcelStatusService.createPurchasePipeLine(data);
            res.status(201).json(newRecord);
        } catch (error) {
            this.logger.error(`Error in createPurchasePipeLine: ${error instanceof Error ? error.message : String(error)}`, error);
            next(error);
        }
    }

    public async updatePurchasePipeLine(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const purtrnid = parseInt(req.params.id); // Assuming 'id' in params is purtrnid
            const data: Partial<PurchasePipeLineEntity> = req.body;
            const updatedRecord = await this.purchaseParcelStatusService.updatePurchasePipeLine(purtrnid, data);
            if (updatedRecord) {
                res.status(200).json(updatedRecord);
            } else {
                res.status(404).json({ message: "Record not found" });
            }
        } catch (error) {
            this.logger.error(`Error in updatePurchasePipeLine: ${error instanceof Error ? error.message : String(error)}`, error);
            next(error);
        }
    }
}