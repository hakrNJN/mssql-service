import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("SerMst")
export class SerMst {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    Name!: string;

    @Column()
    Type!: string;

    @Column()
    YearId!: number;

    @Column({ nullable: true })
    Allow_form?: string;

    @Column({ nullable: true })
    AllowComp?: string;

    @Column({ nullable: true })
    Status?: string;

    @Column({ nullable: true })
    Remark?: string;

    @Column({ nullable: true })
    Suffix?: string;

    @Column({ type: 'bit', nullable: true, default: 1 })
    AcEffect?: boolean;

}