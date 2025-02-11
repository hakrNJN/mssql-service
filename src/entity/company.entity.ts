import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("CompMst")  // Map the entity to the table name
export class CompMst {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    Name!: string;

    @Column()
    Type!: string;

    @Column()
    Owner!: string;

    @Column()
    Short!: string;

    @Column({ nullable: true })
    CompGrp!: string ;

    @Column()
    Add1!: string;

    @Column()
    Add2!: string;

    @Column()
    Add3!: string;

    @Column()
    City!: string;

    @Column({ nullable: true })
    Phone!: string ;

    @Column({ nullable: true })
    Mobile!: string;

    @Column({ nullable: true })
    Fax!: string ;

    @Column({ nullable: true })
    Email!: string ;

    @Column({ nullable: true })
    WebSite!: string ;

    @Column({ nullable: true })
    PanNo!: string ;

    @Column({ nullable: true })
    TanNo!:  string ;

    @Column({ nullable: true })
    TinNo!: string ;

    @Column({ nullable: true })
    CST!: string ;

    @Column({ nullable: true })
    GST!: string ;

    @Column()
    Acc_year!: string;

    @Column({type: "date"})
    AF_Date!: Date; //is it equivalent to DATE in SQL Server!

    @Column({type: "date"})
    AT_Date!: Date;

    @Column()
    Status!: string;

    @Column({ nullable: true })
    Bank!: string ;

    @Column({ nullable: true })
    AcNo!: string ;

    @Column({ nullable: true })
    Branch!: string ;

    @Column({ nullable: true })
    IFSCCode!: string ;

    @Column()
    State!: string;

    @Column()
    PinCode!: string;
}