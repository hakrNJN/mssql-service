import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("CompMst")  // Map the entity to the table name
export class CompMst {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    Name!: string;

    @Column({ nullable: true })
    Type?: string;

    @Column({ nullable: true })
    Owner?: string;

    @Column({ nullable: true })
    Short?: string;

    @Column({ nullable: true })
    CompGrp?: string;

    @Column({ nullable: true })
    Add1?: string;

    @Column({ nullable: true })
    Add2?: string;

    @Column({ nullable: true })
    Add3?: string;

    @Column({ nullable: true })
    City?: string;

    @Column({ nullable: true })
    Phone?: string;

    @Column({ nullable: true })
    Mobile?: string;

    @Column({ nullable: true })
    Fax?: string;

    @Column({ nullable: true })
    Email?: string;

    @Column({ nullable: true })
    WebSite?: string;

    @Column({ nullable: true })
    PanNo?: string;

    @Column({ nullable: true })
    TanNo?:  string;

    @Column({ nullable: true })
    TinNo?: string;

    @Column({ nullable: true })
    CST?: string;

    @Column({ nullable: true })
    GST?: string;

    @Column({ nullable: true })
    Acc_year?: string;

    @Column({type: "date",nullable:true})
    AF_Date?: Date; //is it equivalent to DATE in SQL Server!

    @Column({type: "date", nullable:true})
    AT_Date?: Date;

    @Column({ nullable: true })
    Status?: string;

    @Column({ nullable: true })
    Bank?: string;

    @Column({ nullable: true })
    AcNo?: string;

    @Column({ nullable: true })
    Branch?: string;

    @Column({ nullable: true })
    IFSCCode?: string;

    @Column({ nullable: true })
    State?: string;

    @Column({ nullable: true })
    PinCode?: string;
}