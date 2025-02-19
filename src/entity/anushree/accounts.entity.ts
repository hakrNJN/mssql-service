import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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
    
    // Define ManyToOne relationship to itself for Agent (Customers to Agent)
    @ManyToOne(() => Mast, (agent) => agent.customers) // Removed incorrect 'name' from options
    @JoinColumn({ name: 'AgentId' }) // Correctly specify foreign key column name here
    agent?: Mast; // Property to access the Agent

    // Define OneToMany relationship from Agent to Customers (Agent to Customers)
    @OneToMany(() => Mast, (customer) => customer.agent)
    customers?: Mast[]; // Property to access Customers of an Agent
}