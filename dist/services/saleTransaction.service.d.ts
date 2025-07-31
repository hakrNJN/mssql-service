import { SaleTransaction } from "../entity/phoenixDb/saleTransaction.entity";
import { PhoenixDataSource } from "../providers/phoenix.data-source.provider";
export declare class SaleTransactionService {
    private dataSourceInstance;
    private saleTransactionProvider;
    constructor(dataSourceInstance: PhoenixDataSource);
    initialize(): Promise<void>;
    getTransactionById(id: number): Promise<SaleTransaction | null>;
}
