import { SaleTransaction } from '../entity/phoenixDb/saleTransaction.entity';
import { BaseProviderInterface } from "../interface/base.provider";
import { Filters } from "../types/filter.types";
import { PhoenixDataSource } from "./phoenix.data-source.provider";
export interface SaleTransactionProvider extends BaseProviderInterface<SaleTransaction, Filters<SaleTransaction>> {
    trimWhitespace<T>(obj: T): T;
}
export declare class SaleTransactionProvider {
    private SaleTransactionRepository;
    private dataSourceInstance;
    private readonly logger;
    constructor(dataSourceInstance: PhoenixDataSource);
    private _getRepository;
    initializeRepository(): Promise<void>;
    getTransactionById(id: number): Promise<SaleTransaction | null>;
}
