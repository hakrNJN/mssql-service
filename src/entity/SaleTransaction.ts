import { Column, Entity } from "typeorm";

@Entity("pheonixdb.dbo.SaleTransactions")  // Map the entity to the view name
export class UserView {
    // @PrimaryColumn()
    // id: number;

    @Column()
    CustomerID!: number;

    @Column()
    CustomerName!: string;

    @Column()
    CustomerGstin!: string;

    @Column()
    CustomerAdd1!: string;

    @Column()
    CustomerAdd2!: string;
        
    @Column()
    CustomerCity!: string;

    @Column()
    CustomerState!: string;

    @Column()
    CustomerStateCode!: number;

    @Column()
    CustomerPin!: number;

    @Column()
    PinToPinDistance!: number;

    @Column()
    CustomerPhone!: string;

    @Column()
    CustomerMobile!: string;

    @Column()
    CustomerEmail!: string;

    @Column()
    ShippingID!: number;

    @Column()
    ShippingName!: string;

    @Column()
    ShippingGstin!: string;

    @Column()
    ShippingAdd1!: string;

    @Column()
    ShippingAdd2!: string;

    @Column()
    ShippingCity!: string;

    @Column()
    ShippingState!: string;

    @Column()
    ShippingStateCode!: number;

    @Column()
    ShippingPhone!: string;

    @Column()
    shippingMobile!: string;

    @Column()
    AgentId!: number;

    @Column()
    AgentName!: string;

    @Column()
    AgentAdd1!: string;

    @Column()
    AgentAdd2!: string;

    @Column()
    AgentCity!: string;

    @Column()
    AgentPhone!: string;

    @Column()
    AgentMobile!: number;

    @Column()
    AgentEmail!: string;

    @Column()
    CompanyId!: number;
    
    @Column()
    CompanyName!: string;

    @Column()
    CompanyGstin!: string;

    @Column()
    ComapnyAdd1!: string;

    @Column()
    CompanyAdd2!: string;

    @Column()
    CompanyCity!: string;

    @Column()
    CompanyState!: string;

    @Column()
      ComapnyStateCode!:number;

    @Column()
      CompanyPin!:number;

    @Column()
      ComapnyMobile!:number;

    @Column()
      CompanyPhone!:number;

    @Column()
      CompanyEmail!:string;

    @Column()
      CompanyPan!:string;

    @Column()
      CompanyTin!: string;

    @Column()
      CompanyCin!: string;

    @Column()
      CompanyAccNo!: number;

    @Column()
      CompanyBank!: string;

    @Column()
      CompanyBranch!:string;

    @Column()
      CompanyIfscCode!:string;

    @Column()
      DeliveryPlace!:string;

    @Column()
      TransportID!:number;

    @Column()
      TransporterName!: string;

    @Column()
      TransporterGstin!: string;

    @Column()
      LogisticReceiptNo!:string;

    @Column({ type: "date" })
      LogisticReceiptDate!: Date;

    @Column()
      ParcelCount!:number;

    @Column()
      Remark!:string;

    @Column()
      BillType!:string;

    @Column()
      SalTrnId!: number;

    @Column({ type: "date" })
      Date!: Date;

    @Column()
      Vno!: number;

    @Column()
      InvNo!:string;

    @Column()
      Dhara!: number;

    @Column()
      DueDays!: number;

    @Column()
      BillAmount!:number;

    @Column()
      NetAmount!: number;

    @Column()
      RefBillNo!: string;

    @Column({ type: "date" })
      RefBillDate!:Date;

    @Column()
      TotalPcs!:number;

    @Column()
      Addless!:number;

      @Column()
      TotalGST!: number;

      @Column()
      CGSTAmount!:number;

      @Column()
      SGSTAmount!: number;

      @Column()
      IGSTAmount!:number;

      @Column()
      AlSr1!: number;

      @Column()
      Caption1!: string;

      @Column()
      AlExp1!: string;

      @Column()
      AlRefAmt1!: number;

      @Column()
      AlValue1!:number;

      @Column()
      AlAmount1!: number;

      @Column()
      AlSr2!: string;

      @Column()
      Caption2!: string;

      @Column()
      AlExp2!:string;

      @Column()
      AlRefAmt2!:string;

      @Column()
      AlValue2!: string;

      @Column()
      AlAmount2!: string;

      @Column()
      Type!: number;
    
      @Column()
      Series!:string;

      @Column()
      PackingSeries!: string;

      @Column()
      RefId!: number;
    
      @Column()
      Book!: string;

      @Column()
      TrnOrigin!: string;

      @Column()
      TrnMode!:string;

      @Column()
      OthRmk!:string;

      @Column()
      UserName!: string;

      @Column({ type: "date" })
      LrUpdatedOn!:Date;

      @Column()
      IsService!: string;

      @Column()
      Ewayid!: number;
    
      @Column({ type: "date" })
      EWayDat!:Date;

      @Column()
      IRN!:string;

      @Column({ type: "date" })
      YearStart!:Date;

      @Column({ type: "date" })
      YearENd!: Date;

}