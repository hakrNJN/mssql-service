// src/services/purchaseParcelStatus.service.ts
import { inject, injectable } from "tsyringe";
import { PurchasePipeLine as PurchasePipeLineEntity } from "../entity/phoenixDb/purchasePipeLine.entity";
import { ILogger } from "../interface/logger.interface";
import { InWardOutWardProvider } from "../providers/inwardOutward.provider";
import { PurchasePileLine as PurchasePipeLineProvider } from "../providers/purchasePipeLine.provider";
import { WINSTON_LOGGER } from "../utils/logger";

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
    ) { }

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
        console.log("Inward Outward Entries:", inwardOutwardEntries); // ADDED LINE

        // Extract unique Purtrnid and Type combinations from inwardOutwardEntries
        const uniqueKeys = inwardOutwardEntries.map(entry => ({ Purtrnid: entry.Purtrnid, Type: entry.Type }));
        console.log("Unique Keys for Purchase Pipeline Query:", uniqueKeys); // ADDED LINE

        // Fetch corresponding PurchasePipeLine data
        const purchasePipeLineEntries = await this.purchasePipeLineProvider.getAllWithFilters({
            Purtrnid: { in: uniqueKeys.map(key => key.Purtrnid) },
            Type: { in: uniqueKeys.map(key => key.Type) }
        });
        console.log("Purchase Pipeline Entries:", purchasePipeLineEntries); // ADDED LINE

        // Perform the join in the application layer and map to desired output format
        const joinedData = inwardOutwardEntries.map(inwardEntry => {
            const matchingPurchaseEntry = purchasePipeLineEntries.find(
                purchaseEntry =>
                    purchaseEntry.Purtrnid == inwardEntry.Purtrnid &&
                    purchaseEntry.Type == inwardEntry.Type
            );
            console.log("Matching Purchase Entry:", purchasePipeLineEntries);
            return {
                Purtrnid: inwardEntry.Purtrnid,
                Type: inwardEntry.Type,
                Vno: inwardEntry.Vno,
                Dat: inwardEntry.Dat, // Already formatted in provider
                BillNo: inwardEntry.BillNo,
                Pcs: inwardEntry.Pcs,
                Customer: inwardEntry.Customer,
                City: inwardEntry.City,
                GroupName: inwardEntry.GroupName,
                AgentName: inwardEntry.AgentName,
                BillAmt: inwardEntry.BillAmt,
                LrNo: matchingPurchaseEntry?.LRNo || inwardEntry.LRNo,
                Lrdat: matchingPurchaseEntry?.Lrdat || null,
                RecDat: matchingPurchaseEntry?.ReceiveDate || null,
                OpnDat: matchingPurchaseEntry?.OpenDate || null,
                Company: inwardEntry.Company,
            };
        });

        // Apply filters to the joined data
        if (params.filters && params.filters.length > 0) {
            return joinedData.filter(entry => {
                return params.filters?.every(filter => {
                    switch (filter) {
                        case 'opened':
                            return entry.Lrdat && entry.RecDat && entry.OpnDat;
                        case 'lrpending':
                            return !entry.Lrdat;
                        case 'recpending':
                            return !entry.RecDat;
                        case 'opnpending':
                            return !entry.OpnDat;
                        default:
                            return true;
                    }
                });
            });
        }

        return joinedData;
    }

    async createPurchasePipeLine(data: Partial<PurchasePipeLineEntity>): Promise<PurchasePipeLineEntity> {
        return this.purchasePipeLineProvider.create(data);
    }

    async updatePurchasePipeLine(id: number, data: Partial<PurchasePipeLineEntity>): Promise<PurchasePipeLineEntity | null> {
        return this.purchasePipeLineProvider.update(id, data);
    }
}