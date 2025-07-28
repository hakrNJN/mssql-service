import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity("Vwkotakcmsonline")

export class Vwkotakcmsonline {
    @Column({ nullable: true })
    Client_Code!: string;

    @Column()
    Product_Code!: string;

    @Column()
    Payment_Type!: string;

    @Column()
    Payment_Ref_No!: string;

    @Column({ type: "date", })
    Payment_Date!: Date;

    @Column({ type: "date", nullable: true })
    Instrument_Date?: Date;

    @Column({ nullable: true })
    Dr_Ac_No?: string;

    @Column()
    Amount!: number;

    @Column({ nullable: true })
    Bank_Code_Indicator?: string;

    @Column({ nullable: true })
    Beneficiary_Code?: string;

    @Column({ nullable: true })
    Beneficiary_Name?: string;

    @Column({ nullable: true })
    Beneficiary_Bank?: string;

    @Column({ name: 'Beneficiary_Bank/IFSC_Code', nullable: true })
    Beneficiary_Branch_IFSC_Code?: string;

    @Column({ nullable: true })
    Beneficiary_Acc_No?: string;

    @Column({ nullable: true })
    Location?: string;

    @Column({ nullable: true })
    Print_Location?: string;

    @Column({ nullable: true })
    Instrument_Number?: string;

    @Column({ nullable: true })
    Ben_Add1?: string;
    @Column({ nullable: true })
    Ben_Add2?: string;
    @Column({ nullable: true })
    Ben_Add3?: string;
    @Column({ nullable: true })
    Ben_Add4?: string;
    @Column({ nullable: true })
    Beneficiary_Email?: string;
    @Column({ nullable: true })
    Beneficiary_Mobile?: string;
    @Column({ nullable: true })
    Debit_Narration?: string;
    @Column({ nullable: true })
    Credit_Narration?: string;
    @Column({ nullable: true })
    Payment_Details_1?: string;
    @Column({ nullable: true })
    Payment_Details_2?: string;
    @Column({ nullable: true })
    Payment_Details_3?: string;
    @Column({ nullable: true })
    Payment_Details_4?: string;
    @Column({ nullable: true })
    Enrichment_1?: string;
    @Column({ nullable: true })
    Enrichment_2?: string;
    @Column({ nullable: true })
    Enrichment_3?: string;
    @Column({ nullable: true })
    Enrichment_4?: string;
    @Column({ nullable: true })
    Enrichment_5?: string;
    @Column({ nullable: true })
    Enrichment_6?: string;
    @Column({ nullable: true })
    Enrichment_7?: string;
    @Column({ nullable: true })
    Enrichment_8?: string;
    @Column({ nullable: true })
    Enrichment_9?: string;
    @Column({ nullable: true })
    Enrichment_10?: string;
    @Column({ nullable: true })
    Enrichment_11?: string;
    @Column({ nullable: true })
    Enrichment_12?: string;
    @Column({ nullable: true })
    Enrichment_13?: string;
    @Column({ nullable: true })
    Enrichment_14?: string;
    @Column({ nullable: true })
    Enrichment_15?: string;
    @Column({ nullable: true })
    Enrichment_16?: string;
    @Column({ nullable: true })
    Enrichment_17?: string;
    @Column({ nullable: true })
    Enrichment_18?: string;
    @Column({ nullable: true })
    Enrichment_19?: string;
    @Column({ nullable: true })
    Enrichment_20?: string;

    @Column()
    Conum!: string; // Company number
    @PrimaryColumn()
    vno!: number;
}
