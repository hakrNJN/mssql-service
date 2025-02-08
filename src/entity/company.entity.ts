import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("CompMst")  // Map the entity to the table name
export class CompMst {
    @PrimaryGeneratedColumn()
    Id!: number;

    @Column()
    Name!: string;

    @Column()
    Type!: string;

    @Column()
    Owner!: string;

    @Column()
    Short!: string;

    @Column({ nullable: true })
    CompGrp?: string | null;

    @Column()
    Add1!: string;

    @Column()
    Add2!: string;

    @Column()
    Add3!: string;

    @Column()
    City!: string;

    @Column({ nullable: true })
    Phone?: string | null;

    @Column({ nullable: true })
    Mobile?: string | null;

    @Column({ nullable: true })
    Fax?: string | null;

    @Column({ nullable: true })
    Email?: string | null;

    @Column({ nullable: true })
    WebSite?: string | null;

    @Column({ nullable: true })
    PanNo?: string | null;

    @Column({ nullable: true })
    TanNo?:  string | null;

    @Column({ nullable: true })
    TinNo?: string | null;

    @Column({ nullable: true })
    CST?: string | null;

    @Column({ nullable: true })
    GST?: string | null;

    @Column()
    Acc_year!: string;

    @Column({type: "date"})
    AF_Date!: Date; //is it equivalent to DATE in SQL Server?

    @Column({type: "date"})
    AT_Date!: Date;

    @Column()
    Status!: string;

    @Column({ nullable: true })
    Bank?: string | null;

    @Column({ nullable: true })
    AcNo?: string | null;

    @Column({ nullable: true })
    Branch?: string | null;

    @Column({ nullable: true })
    IFSCCode?: string | null;;

    @Column()
    State!: string;

    @Column()
    PinCode!: string;
}