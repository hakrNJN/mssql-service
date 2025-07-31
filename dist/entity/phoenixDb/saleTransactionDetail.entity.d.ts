import { SaleTransaction } from "./saleTransaction.entity";
export declare class SaleTransactionDetails {
    SalTrnId: string;
    Srno: number;
    Quality: string;
    CatelogName: string;
    ProductDescription: string;
    HSNCode: number;
    PkgType: string;
    Unit: string;
    Qnty: number;
    Rate: number;
    ItemGrossAmt: number;
    DisPer: number;
    Discount: number;
    TaxableAmount: number;
    TaxRate: number;
    IGSTRate: number;
    IGSTAmount: number;
    CGSTRate: number;
    CGSTAmount: number;
    SGSTRate: number;
    SGSTAmount: number;
    saleTransaction: SaleTransaction;
}
