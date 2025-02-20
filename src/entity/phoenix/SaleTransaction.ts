import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { SaleTransactionDetails } from "./saleTransactionDetail";

// @Entity({ name: "SaleTransactions", database: "pheonixdb", schema: "dbo" })  // Map the entity to the view name
@Entity("SaleTransaction",)  // Map the entity to the view name
export class SaleTransaction {
  // @PrimaryColumn()
  // id: number;

  @Column()
  CustomerID!: number;

  @Column()
  CustomerName!: string;

  @Column({ nullable: true })
  CustomerGstin?: string;

  @Column({ nullable: true })
  CustomerAdd1?: string;

  @Column({ nullable: true })
  CustomerAdd2?: string;

  @Column({ nullable: true })
  CustomerCity?: string;

  @Column({ nullable: true })
  CustomerState?: string;

  @Column({ nullable: true })
  CustomerStateCode?: number;

  @Column({ nullable: true })
  CustomerPin?: number;

  @Column({ nullable: true })
  PinToPinDistance?: number;

  @Column({ nullable: true })
  CustomerPhone?: string;

  @Column({ nullable: true })
  CustomerMobile?: string;

  @Column({ nullable: true })
  CustomerEmail?: string;

  @Column({ nullable: true })
  ShippingID?: number;

  @Column({ nullable: true })
  ShippingName?: string;

  @Column({ nullable: true })
  ShippingGstin?: string;

  @Column({ nullable: true })
  ShippingAdd1?: string;

  @Column({ nullable: true })
  ShippingAdd2?: string;

  @Column({ nullable: true })
  ShippingCity?: string;

  @Column({ nullable: true })
  ShippingState?: string;

  @Column({ nullable: true })
  ShippingStateCode?: number;

  @Column({ nullable: true })
  ShippingPhone?: string;

  @Column({ nullable: true })
  shippingMobile?: string;

  @Column()
  AgentId!: number;

  @Column()
  AgentName!: string;

  @Column({ nullable: true })
  AgentAdd1?: string;

  @Column({ nullable: true })
  AgentAdd2?: string;

  @Column({ nullable: true })
  AgentCity?: string;

  @Column({ nullable: true })
  AgentPhone?: string;

  @Column({ nullable: true })
  AgentMobile?: number;

  @Column({ nullable: true })
  AgentEmail?: string;

  @Column()
  CompanyId!: number;

  @Column()
  CompanyName!: string;

  @Column({ nullable: true })
  CompanyGstin?: string;

  @Column({ nullable: true })
  CompanyAdd1?: string;

  @Column({ nullable: true })
  CompanyAdd2?: string;

  @Column({ nullable: true })
  CompanyCity?: string;

  @Column({ nullable: true })
  CompanyState?: string;

  @Column({ nullable: true })
  CompanyStateCode?: number;

  @Column({ nullable: true })
  CompanyPin?: number;

  @Column({ nullable: true })
  CompanyMobile?: number;

  @Column({ nullable: true })
  CompanyPhone?: number;

  @Column({ nullable: true })
  CompanyEmail?: string;

  @Column({ nullable: true })
  CompanyPan?: string;

  @Column({ nullable: true })
  CompanyTin?: string;

  @Column({ nullable: true })
  CompanyCin?: string;

  @Column({ nullable: true })
  CompanyAccNo?: number;

  @Column({ nullable: true })
  CompanyBank?: string;

  @Column({ nullable: true })
  CompanyBranch?: string;

  @Column({ nullable: true })
  CompanyIfscCode?: string;

  @Column({ nullable: true })
  DeliveryPlace?: string;

  @Column({ nullable: true })
  TransportID?: number;

  @Column({ nullable: true })
  TransporterName?: string;

  @Column({ nullable: true })
  TransporterGstin?: string;

  @Column({ nullable: true })
  LogisticReceiptNo?: string;

  @Column({ type: "date", nullable: true })
  LogisticReceiptDate?: Date;

  @Column()
  ParcelCount!: number;

  @Column({ nullable: true })
  Remark?: string;

  @Column()
  BillType!: string;

  @PrimaryColumn()//@Column()
  SalTrnId!: number;

  @Column({ type: "date" })
  Date!: Date;

  @Column()
  Vno!: number;

  @Column()
  InvNo!: string;

  @Column({ nullable: true })
  Dhara?: number;

  @Column({ nullable: true })
  DueDays?: number;

  @Column()
  BillAmount!: number;

  @Column()
  NetAmount!: number;

  @Column({ nullable: true })
  RefBillNo?: string;

  @Column({ type: "date", nullable: true })
  RefBillDate?: Date;

  @Column()
  TotalPcs!: number;

  @Column({ nullable: true })
  Addless?: number;

  @Column()
  TotalGST!: number;

  @Column()
  CGSTAmount!: number;

  @Column()
  SGSTAmount!: number;

  @Column()
  IGSTAmount!: number;

  @Column({ nullable: true })
  AlSr1?: number;

  @Column({ nullable: true })
  Caption1?: string;

  @Column({ nullable: true })
  AlExp1?: string;

  @Column({ nullable: true })
  AlRefAmt1?: number;

  @Column({ nullable: true })
  AlValue1?: number;

  @Column({ nullable: true })
  AlAmount1?: number;

  @Column({ nullable: true })
  AlSr2?: string;

  @Column({ nullable: true })
  Caption2?: string;

  @Column({ nullable: true })
  AlExp2?: string;

  @Column({ nullable: true })
  AlRefAmt2?: string;

  @Column({ nullable: true })
  AlValue2?: string;

  @Column({ nullable: true })
  AlAmount2?: string;

  @Column()
  Type!: number;

  @Column()
  Series!: string;

  @Column({ nullable: true })
  PackingSeries?: string;

  @Column()
  RefId!: number;

  @Column()
  Book!: string;

  @Column()
  TrnOrigin!: string;

  @Column()
  TrnMode!: string;

  @Column({ nullable: true })
  OthRmk?: string;

  @Column()
  UserName!: string;

  @Column({ type: "date", nullable: true })
  LrUpdatedOn?: Date;

  @Column()
  IsService!: string;

  @Column({ nullable: true })
  Ewayid?: number;

  @Column({ type: "date", nullable: true })
  EWayDat?: Date;

  @Column({ nullable: true })
  IRN?: string;

  @Column({ type: "date" })
  YearStart!: Date;

  @Column({ type: "date" })
  YearENd!: Date;

  @OneToMany(() => SaleTransactionDetails, (saleTransactionDetail) => saleTransactionDetail.saleTransaction)
  products?: SaleTransactionDetails[]; 

}