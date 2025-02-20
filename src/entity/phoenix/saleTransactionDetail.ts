import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { SaleTransaction } from "./SaleTransaction";

// @Entity({ name: "SaleTransactionDetail", database: "pheonixdb", schema: "dbo" })  // Map the entity to the view name wit database and schema
@Entity("SaleTransactionDetails")  // Map the entity to the view name wit database and schema
export class SaleTransactionDetails {
  // @PrimaryColumn()
  // id: number;
  // @PrimaryGeneratedColumn() // New auto-incrementing primary key - IMPORTANT CHANGE
  // id?: number;

  @Column()
  SalTrnId!: string

  @PrimaryColumn()
  Srno!: number;

  @Column()
  Quality!: string

  @Column()
  CatelogName!: string

  @Column()
  ProductDescription!: string

  @Column()
  HSNCode!: number;

  @Column()
  PkgType!: string

  @Column()
  Unit!: string

  @Column()
  Qnty!: number;

  @Column()
  Rate!: number;

  @Column()
  ItemGrossAmt!: number;

  @Column()
  DisPer!: number;

  @Column()
  Discount!: number;

  @Column()
  TaxableAmount!: number;

  @Column()
  TaxRate!: number;

  @Column()
  IGSTRate!: number;

  @Column()
  IGSTAmount!: number;

  @Column()
  CGSTRate!: number;

  @Column()
  CGSTAmount!: number;

  @Column()
  SGSTRate!: number;

  @Column()
  SGSTAmount!: number;

  @ManyToOne(() => SaleTransaction, (saleTransaction) => saleTransaction.products)
  @JoinColumn({ name: "SalTrnId" })
  saleTransaction!: SaleTransaction;
}