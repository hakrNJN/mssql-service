//src/services/saleTransaction.service.ts

import { SaleTransaction } from "../entity/phoenixDb/saleTransaction.entity";

import { SaleTransactionProvider } from "../providers/saleTransaction.provider";

import { inject, injectable } from "tsyringe";

@injectable()
export class SaleTransactionService {
    private saleTransactionProvider: SaleTransactionProvider;

    constructor(
        @inject(SaleTransactionProvider) saleTransactionProvider: SaleTransactionProvider
    ) {
        this.saleTransactionProvider = saleTransactionProvider;
        }

    async getTransactionById(id: number):Promise<SaleTransaction | null > {
        return this.saleTransactionProvider.getTransactionById(id);
    }

}