import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("YearMst")
export class YearMst {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    Name!: string;

    @Column({ type: "date" })
    AFDat!: Date;

    @Column({ type: "date" })
    ATDat!: Date;

    @Column()
    AllowComp!: string;

    @Column()
    Status!: string;

    @Column()
    UserId!: string;

    @Column()
    UpdDate!: string;

    @Column()
    AuditLock!: string; //is it equivalent to CHAR(1) in SQL Server?

    @Column()
    DbName!: string;

    // @Column({ nullable: true })
    // Code!: string | null; //this is how to make a column nullable.
}