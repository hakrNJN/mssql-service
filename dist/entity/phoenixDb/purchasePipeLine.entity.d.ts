import { SpTblFinishInWardOutWard } from "../anushreeDb/spTblFinishInWardOutWard.entity";
export declare class PurchasePipeLine {
    id: number;
    Purtrnid: number;
    Type: number;
    Vno: number;
    Dat: Date;
    BillNo: string;
    Customer: string;
    City: string;
    GroupName: string | null;
    AgentName: string;
    BillAmt: number;
    Comapny: string;
    LRNo: string;
    Lrdat: Date;
    ReceiveDate: Date | null;
    OpenDate: Date | null;
    Entrydate: Date;
    UpdDate: Date;
    finishInWards: SpTblFinishInWardOutWard[];
}
