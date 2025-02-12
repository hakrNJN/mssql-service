```
└── 📁src
    └── 📁config
        └── config.ts
    └── 📁controllers
        └── example.ts
    └── 📁entity
        └── company.entity.ts
        └── SaleTransaction.ts
        └── years.entity.ts
    └── 📁exceptions
        └── httpException.ts
    └── 📁interface
        └── sqlInstance.ts
    └── 📁middleware
        └── errorHandler.ts
    └── 📁migration
    └── 📁providers
        └── data_access.provider.ts
        └── data-source.provider.ts
        └── express.provider.ts
    └── 📁routes
        └── index.ts
    └── 📁services
        └── example2.ts
        └── serviceExample.ts
    └── 📁tests
    └── 📁utils
        └── logger.ts
        └── queryTypes.ts
    └── 📁validators
    └── App.ts
    └── index.ts
```

1. Define Your Entities (SaleTransaction and SaleDetails)

// sale-transaction.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn } from 'typeorm';
import { SaleDetail } from './sale-detail.entity';
import { Mast } from "./Mast.entity";
import { Aldet } from "./Aldet.entity";

@Entity('sale_transactions') // Specify your table name if needed
export class SaleTransaction {
  @PrimaryGeneratedColumn()
  saleTrnId: number;

  @Column()
  transactionDate: Date;

  @Column()
  customerName: string;

 // One-to-Many relationship with SalDet (SalTrn has many SalDet records)
    @OneToMany(() => SalDet, (salDet) => salDet.salTrn)
    salDetails?: SalDet[];

    // Many-to-One relationship with Mast (SalTrn belongs to one Mast - Account)
    @ManyToOne(() => Mast, (mast) => mast.salTrns)
    @JoinColumn({ name: "accountId" })
    account?: Mast;

    // One-to-Many relationship with Aldet (SalTrn has many Aldet records, composite key join)
    @OneToMany(() => Aldet, (alDet) => alDet.lnktrnid)
    additionalAmounts?: Aldet[];

// sale-detail.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { SaleTransaction } from './sale-transaction.entity';

@Entity('sale_details') // Specify your table name if needed
export class SaleDetail {
  @PrimaryGeneratedColumn()
  saleDetailId: number;

  @Column()
  itemName: string;

  @Column()
  quantity: number;

  @Column()
  price: number;

  // Many-to-One relationship with SaleTransaction
  @ManyToOne(() => SalTrn, (salTrn) => salTrn.salDetails)
  @JoinColumn({ name: 'saleTrnId' }) // Foreign key column in SaleDetail referencing SaleTransaction
  saleTransaction: SaleTransaction;

  @Column() // Foreign key column, explicitly define it if needed for clarity
  saleTrnId: number;
}


Explanation of Entity Definitions:

@OneToMany in SaleTransaction:

() => SaleDetail: Specifies the related entity (SaleDetail).

(saleDetail) => saleDetail.saleTransaction: This is the inverse side of the relationship. It tells TypeORM how SaleDetail relates back to SaleTransaction (using the saleTransaction property in SaleDetail).

{ eager: true }: This is the key part! Setting eager: true enables eager loading for the saleDetails relationship. Whenever you fetch a SaleTransaction, TypeORM will automatically fetch the associated SaleDetails.

cascade: true: (Optional) If you want operations like saving or deleting a SaleTransaction to automatically cascade to its SaleDetails, include cascade: true. Be mindful of cascade operations and their implications.

@JoinColumn({ name: 'saleTrnId' }): (Optional but good practice for clarity) Explicitly defines the foreign key column in the SaleTransaction entity. While TypeORM can often infer this, being explicit can improve readability and prevent ambiguity.

@ManyToOne in SaleDetail:

() => SaleTransaction: Specifies the related entity (SaleTransaction).

(saleTransaction) => saleTransaction.saleDetails: This is the owning side of the relationship. It tells TypeORM how SaleDetail relates to SaleTransaction (using the saleDetails property in SaleTransaction).

@JoinColumn({ name: 'saleTrnId' }): Defines the foreign key column (saleTrnId) in the SaleDetail table that links back to the SaleTransaction table's primary key (saleTrnId).

saleTrnId: number;: It's good practice to also explicitly define the foreign key column property in your SaleDetail entity. This makes it easier to work with foreign keys directly if needed.

2. Fetching SaleTransaction with Eagerly Loaded SaleDetails

Now, when you fetch SaleTransaction entities, the saleDetails will be automatically loaded due to eager: true.

// Example in your service or controller

import { getRepository } from 'typeorm';
import { SaleTransaction } from './sale-transaction.entity';

export const getSaleTransactions = async () => {
  const saleTransactionRepository = getRepository(SaleTransaction);

  // Fetch all SaleTransactions with eagerly loaded SaleDetails
  const saleTransactions = await saleTransactionRepository.find();

  // Now, each saleTransaction in saleTransactions will have its saleDetails populated
  return saleTransactions;
};