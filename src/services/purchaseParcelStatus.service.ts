// src/services/purchaseParcelStatus.service.ts
import { inject, injectable } from "tsyringe";
import { InWardOutWardProvider } from "../providers/inwardOutward.provider";
import { PurchasePileLine as PurchasePipeLineProvider } from "../providers/purchasePipeLine.provider";
import { ILogger } from "../interface/logger.interface";
import { WINSTON_LOGGER } from "../utils/logger";
import { PurchasePipeLine as PurchasePipeLineEntity } from "../entity/phoenixDb/purchasePipeLine.entity";

export interface IGetPurchaseParcelStatusParams {
    conum: string;
    fdat: string;
    tdat: string;
    accountId: string;
    agentid?: string[];
    filters?: string[]; // ['opened', 'lrpending']
}

export interface IPurchaseParcelStatusService {
    getPurchaseParcelStatus(params: IGetPurchaseParcelStatusParams, offset?: number, limit?: number): Promise<any[]>;
    createPurchasePipeLine(data: Partial<PurchasePipeLineEntity>): Promise<PurchasePipeLineEntity>;
    updatePurchasePipeLine(purtrnid: number, data: Partial<PurchasePipeLineEntity>): Promise<PurchasePipeLineEntity | null>;
}

@injectable()
export class PurchaseParcelStatusService implements IPurchaseParcelStatusService {
    constructor(
        @inject(WINSTON_LOGGER) private logger: ILogger,
        @inject("InWardOutWardProvider") private inwardOutwardProvider: InWardOutWardProvider,
        @inject("PurchasePileLine") private purchasePipeLineProvider: PurchasePipeLineProvider
    ) {}

    private buildWhereCondition(params: IGetPurchaseParcelStatusParams): string {
        let condition = `T.conum = '${params.conum}'`;

        if (params.agentid && params.agentid.length > 0) {
            condition += ` AND T.agentid IN (${params.agentid.map(id => `'${id}'`).join(", ")})`;
        }
        if (params.accountId) {
            condition += ` AND T.accountid = N'${params.accountId}'`;
        }
        if (params.fdat && params.tdat) {
            condition += ` AND T.dat BETWEEN '${params.fdat}' AND '${params.tdat}'`;
        }

        return condition;
    }

    async getPurchaseParcelStatus(params: IGetPurchaseParcelStatusParams, offset?: number, limit?: number): Promise<any[]> {
        this.logger.info(`Getting purchase parcel status with params: ${JSON.stringify(params)}`);

        const whereCondition = this.buildWhereCondition(params);

        const inwardOutwardEntries = await this.inwardOutwardProvider.getEntriesByFilter(
            params.conum,
            params.fdat,
            params.tdat,
            params.accountId,
            whereCondition,
            offset,
            limit
        );

        // Extract unique Purtrnid and Type combinations from inwardOutwardEntries
        const uniqueKeys = inwardOutwardEntries.map(entry => ({ Purtrnid: entry.Purtrnid, Type: entry.Type }));

        // Fetch corresponding PurchasePipeLine data
        const purchasePipeLineEntries = await this.purchasePipeLineProvider.getAllWithFilters({
            Purtrnid: { "$in": uniqueKeys.map(key => key.Purtrnid) },
            Type: { "$in": uniqueKeys.map(key => key.Type) }
        });

        // Perform the join in the application layer
        const joinedData = inwardOutwardEntries.map(inwardEntry => {
            const matchingPurchaseEntry = purchasePipeLineEntries.find(
                purchaseEntry =>
                    purchaseEntry.Purtrnid === inwardEntry.Purtrnid &&
                    purchaseEntry.Type === inwardEntry.Type
            );

            return {
                ...inwardEntry,
                LrNo: matchingPurchaseEntry?.LRNo || inwardEntry.LRNo,
                Lrdat: matchingPurchaseEntry?.Lrdat,
                RecDat: matchingPurchaseEntry?.ReceiveDate,
                OpnDat: matchingPurchaseEntry?.OpenDate,
            };
        });

        return joinedData;
    }

    async createPurchasePipeLine(data: Partial<PurchasePipeLineEntity>): Promise<PurchasePipeLineEntity> {
        return this.purchasePipeLineProvider.create(data);
    }

    async updatePurchasePipeLine(id: number, data: Partial<PurchasePipeLineEntity>): Promise<PurchasePipeLineEntity | null> {
        return this.purchasePipeLineProvider.update(id, data);
    }
}
