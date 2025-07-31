import { PurchasePipeLine as PurchasePipeLineEntity } from "../entity/phoenixDb/purchasePipeLine.entity";
import { BaseProviderInterface } from "../interface/base.provider";
import { Filters } from "../types/filter.types";
import { AppDataSource } from "./data-source.provider";
export interface PurchasePileLineInterface extends BaseProviderInterface<PurchasePipeLineEntity, Filters<PurchasePipeLineEntity>> {
    trimWhitespace<T>(obj: T): T;
}
export declare class PurchasePileLine implements PurchasePileLineInterface {
    private purchasePipeLineRepository;
    private dataSourceInstance;
    private readonly logger;
    constructor(dataSourceInstance: AppDataSource);
    getAll(offset?: number, limit?: number): Promise<PurchasePipeLineEntity[]>;
    private _getRepository;
    initializeRepository(): Promise<void>;
    getAllWithFilters(filters?: Filters<PurchasePipeLineEntity>, offset?: number, limit?: number): Promise<PurchasePipeLineEntity[]>;
    getById(id: number): Promise<PurchasePipeLineEntity | null>;
    create(data: Partial<PurchasePipeLineEntity>): Promise<PurchasePipeLineEntity>;
    update(id: number, data: Partial<PurchasePipeLineEntity>): Promise<PurchasePipeLineEntity | null>;
    delete(id: number): Promise<boolean>;
    trimWhitespace<T>(obj: T): T;
}
