import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("Mast")
export class Mast {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    Name!: string;

    @Column({ nullable: true })
    Add1?: string;

    @Column({ nullable: true })
    Add2?: string;

    @Column({ nullable: true })
    City?: string;

    @Column({ nullable: true })
    State?: string;

    @Column({ nullable: true })
    PinCode?: number

    @Column({ nullable: true })
    Mobile?: string;

    @Column({ nullable: true })
    Email?: string;

    @Column({ nullable: true })
    ContPerson?: string;

    @Column({ nullable: true })
    PanNo?: string;

    @Column({ nullable: true })
    GST?: string;

    @Column({ nullable: true })
    Status?: string;

    @Column({ nullable: true })
    Bank?: string;

    @Column({ nullable: true })
    AcNo?: string;

    @Column({ nullable: true })
    IFSCCode?: string;

    @Column({ nullable: true })
    BlackList?: string;

    @Column({ nullable: true })
    Type?: number;

    @Column({ nullable: true })
    SchdId?: number;

    @Column({ nullable: true })
    Group?: number;

    @Column({ nullable: true })
    AgentId?: number;
}