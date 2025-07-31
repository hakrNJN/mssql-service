// src/entity/anushree/SerMst.entity.ts
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Vwkotakcmsonline } from "./kotakCMS.entity"; // Import Vwkotakcmsonline

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

    // OneToMany relationship to Vwkotakcmsonline
    @OneToMany(() => Vwkotakcmsonline, vwkotakcmsonline => vwkotakcmsonline.seriesMaster)
    vwkotakcmsonlineEntries!: Vwkotakcmsonline[];
}