//src/services/saleTransaction.service.ts

import { SaleTransaction } from "../entity/phoenix/SaleTransaction";
import { PhoenixDataSource } from "../providers/phoenix.data-source.provider";
import { SaleTransactionProvider } from "../providers/saleTransaction.provider";

export class SaleTransactionService {
    private saleTransactionProvider: SaleTransactionProvider;

    constructor(private dataSourceInstance: PhoenixDataSource) {
        this.saleTransactionProvider = new SaleTransactionProvider(this.dataSourceInstance)
    }

    async initialize(): Promise<void> {
        await this.saleTransactionProvider.initializeRepository();
    }

    async getTransactionById(id: number):Promise<SaleTransaction | null > {
        return this.saleTransactionProvider.getTransactionById(id);
    }

}