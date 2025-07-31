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

    @Column({nullable:true})
    AllowComp?: string;

    @Column({nullable:true})
    Status?: string;

    @Column({nullable:true})
    UserId?: string;

    @Column({nullable:true})
    UpdDate?: string;

    @Column({nullable:true})
    AuditLock?: string; //is it equivalent to CHAR(1) in SQL Server?

    @Column({nullable:true})
    DbName?: string;

    @Column({ nullable: true })
    Code?: string; //this is how to make a column nullable.
}