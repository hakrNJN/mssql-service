import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { SpTblFinishInWardOutWard } from "../anushreeDb/spTblFinishInWardOutWard.entity";

@Entity('PurchasePipeLine')
export class PurchasePipeLine {
    @PrimaryColumn()
    Purtrnid!: number;

    @Column()
    Type!: number;

    @Column()
    Vno!: number;

    @Column({ type: 'datetime' })
    Dat!: Date;

    @Column()
    BillNo!: string;

    @Column()
    Customer!: string;

    @Column()
    City!: string;

    @Column({ nullable: true })
    GroupName?: string;

    @Column()
    AgentName!: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    BillAmt!: number;

    @Column()
    Comapny!: string;

    @Column()
    LRNo!: string;

    @Column({ type: 'datetime' })
    Lrdat!: Date;

    @Column({ type: 'datetime', nullable: true })
    ReceiveDate!: Date | null;

    @Column({ type: 'datetime', nullable: true })
    OpenDate!: Date | null;

    @Column({ type: 'datetime' })
    Entrydate!: Date;

    @Column({ type: 'datetime' })
    UpdDate!: Date;

    @OneToMany(() => SpTblFinishInWardOutWard, finishInWard => finishInWard.purchasePipeline)
    finishInWards!: SpTblFinishInWardOutWard[];
}
