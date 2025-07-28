import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PurchasePipeLine } from '../phoenix/PurchasePipeLine';

@Entity("SpTblFinishInWardOutWard")

export class SpTblFinishInWardOutWard {
    @Column()
    Conum!: number;

    @Column()
    Type!: number;

    @Column()
    Vno!: number;

    @Column()
    Dat!: Date;

    @Column()
    BillNo!: string;

    @Column()
    Series!: string;

    @Column()
    LRCase!: number;

    @Column()
    LRNo!: string;

    @Column()
    Transport!: string;

    @Column()
    Customer!: string;

    @Column()
    Category!: string;

    @Column({ nullable: true })
    GRPName?: null | string;

    @Column({ nullable: true })
    Add1?: null | string;

    @Column({ nullable: true })
    Add2?: null | string;

    @Column({ nullable: true })
    City?: null | string;

    @Column({ nullable: true })
    State?: null | string;

    @Column({ nullable: true })
    Mobile?: null | string;

    @Column({ nullable: true })
    Phone?: null | string;

    @Column({ nullable: true })
    ConsPerson?: null | string;

    @Column()
    BillAmount!: number;

    @Column()
    NetAmt!: number;

    @Column()
    Qualid!: number;

    @Column()
    Baseid!: number;

    @Column()
    Item!: string;

    @Column()
    Quality!: string;

    @Column()
    DesignNo!: string;

    @Column()
    AgentName!: string;
    @Column()

    AgentCity!: string;

    @Column()
    TrnMode!: string;

    @Column()
    TrnOrigin!: string;

    @Column()
    Book!: string;

    @Column()
    AgentId!: number;

    @Column()
    AccountID!: number;

    @Column()
    RefId!: number;

    @Column()
    Pcs!: number;

    @Column()
    Mtr!: number;

    @Column()
    Rate!: number;

    @Column()
    Amount!: number;

    @Column()
    Plain!: number;

    @Column()
    Company!: string;

    @Column({ nullable: true })
    CAdd1?: null | string;;

    @Column({ nullable: true })
    CAdd2?: null | string;

    @Column()
    BalPcs!: Number;

    @Column()
    BalMtr!: Number;

    @Column()
    CmpType!: string;

    @Column()
    SiteName!: string;

    @Column()
    SchdName!: string;

    @PrimaryGeneratedColumn()
    PurtrnId!: number; // This is the actual primary key of SpTblFinishInWardOutWard itself

    @ManyToOne(() => PurchasePipeLine, purchasePipeline => purchasePipeline.finishInWards) // Add inverse relation
    @JoinColumn([
        { name: "Purtrnid", referencedColumnName: "Purtrnid" }, // Join on Purtrnid
        { name: "Type", referencedColumnName: "Type" }       // Join on Type
    ])
    purchasePipeline!: PurchasePipeLine;
}
