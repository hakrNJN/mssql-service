// src/tests/services/PurchaseInwardOutWard.service.test.ts
import { SpTblFinishInWardOutWard } from '../../entity/anushreeDb/spTblFinishInWardOutWard.entity';
import { PurchasePipeLine } from '../../entity/phoenixDb/purchasePipeLine.entity';
import { AppDataSource } from '../../providers/data-source.provider';
import { InWardOutWardProvider } from '../../providers/inwardOutward.provider';
import { PurchasePileLine as PurchasePileLineProvider } from '../../providers/purchasePipeLine.provider';
import { PurchaseParcelStatusService } from '../../services/purchaseInwardOutWard.service';

// Mock providers
jest.mock('../../providers/inwardOutward.provider');
jest.mock('../../providers/purchasePipeLine.provider');

describe('PurchaseParcelStatusService', () => {
  let service: PurchaseParcelStatusService;
  let mockInWardOutWardProvider: jest.Mocked<InWardOutWardProvider>;
  let mockPurchasePileLineProvider: jest.Mocked<PurchasePileLineProvider>;
  let mockDataSource: jest.Mocked<AppDataSource>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockDataSource = {} as jest.Mocked<AppDataSource>; // Mock AppDataSource

    // Mock the constructors to return mocked instances
    (InWardOutWardProvider as jest.Mock).mockImplementation(() => ({
      initializeRepository: jest.fn().mockResolvedValue(undefined),
      getEntriesByFilter: jest.fn(),
      getEntryByIdFromSPData: jest.fn(),
    }));
    (PurchasePileLineProvider as jest.Mock).mockImplementation(() => ({
      initializeRepository: jest.fn().mockResolvedValue(undefined),
      create: jest.fn(),
      update: jest.fn(),
    }));

    service = new PurchaseParcelStatusService(mockDataSource);
    // Get the mocked instances after the service is created
    mockInWardOutWardProvider = (service as any).inwardOutWardProvider;
    mockPurchasePileLineProvider = (service as any).purchasePileLineProvider;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('initialize', () => {
    it('should initialize both providers\' repositories', async () => { // Fixed syntax error
      await service.initialize();
      expect(mockInWardOutWardProvider.initializeRepository).toHaveBeenCalledTimes(1);
      expect(mockPurchasePileLineProvider.initializeRepository).toHaveBeenCalledTimes(1);
    });
  });

  describe('getEntriesByFilter', () => {
    it('should call getEntriesByFilter on the inwardOutWardProvider', async () => {
      // Provide more complete mock data for SpTblFinishInWardOutWard
      const mockEntries: SpTblFinishInWardOutWard[] = [{
        Conum: 1,
        Type: 1,
        Vno: 100,
        Dat: new Date(),
        BillNo: 'B123',
        Series: 'S1',
        LRCase: 1,
        LRNo: 'LRN1',
        Transport: 'TRN1',
        Customer: 'CUST1',
        Category: 'CAT1',
        BillAmount: 1000,
        NetAmt: 900,
        Qualid: 1,
        Baseid: 1,
        Item: 'ITEM1',
        Quality: 'Q1',
        DesignNo: 'D1',
        AgentName: 'AGN1',
        AgentCity: 'AGCITY1',
        TrnMode: 'TRMODE1',
        TrnOrigin: 'TRORIGIN1',
        Book: 'BOOK1',
        AgentId: 1,
        AccountID: 1,
        RefId: 1,
        Pcs: 10,
        Mtr: 50,
        Rate: 100,
        Amount: 5000,
        Plain: 1,
        Company: 'COMP1',
        BalPcs: 5,
        BalMtr: 25,
        CmpType: 'CMPTYPE1',
        SiteName: 'SITE1',
        SchdName: 'SCHD1',
        PurtrnId: 1,
        purchasePipeline: {} as PurchasePipeLine, // Added missing property
      } as SpTblFinishInWardOutWard];
      mockInWardOutWardProvider.getEntriesByFilter.mockResolvedValue(mockEntries);

      const conum = '1'; // Changed to string to match service method signature
      const fdat = '2023-01-01';
      const tdat = '2023-01-31';
      const accountId = 'ACC1';
      const filters = { PurtrnId: { equal: 1 } }; // Corrected PurTrnId to PurtrnId
      const offset = 0;
      const limit = 10;

      const result = await service.getEntriesByFilter(conum, fdat, tdat, accountId, filters, offset, limit);

      expect(result).toEqual(mockEntries);
      expect(mockInWardOutWardProvider.getEntriesByFilter).toHaveBeenCalledWith(
        conum, fdat, tdat, accountId, filters, offset, limit
      );
    });
  });

  describe('GetEntrybyId', () => {
    it('should call getEntryByIdFromSPData on the inwardOutWardProvider', async () => {
      // Provide more complete mock data for SpTblFinishInWardOutWard
      const mockEntry: SpTblFinishInWardOutWard = {
        Conum: 1,
        Type: 1,
        Vno: 100,
        Dat: new Date(),
        BillNo: 'B123',
        Series: 'S1',
        LRCase: 1,
        LRNo: 'LRN1',
        Transport: 'TRN1',
        Customer: 'CUST1',
        Category: 'CAT1',
        BillAmount: 1000,
        NetAmt: 900,
        Qualid: 1,
        Baseid: 1,
        Item: 'ITEM1',
        Quality: 'Q1',
        DesignNo: 'D1',
        AgentName: 'AGN1',
        AgentCity: 'AGCITY1',
        TrnMode: 'TRMODE1',
        TrnOrigin: 'TRORIGIN1',
        Book: 'BOOK1',
        AgentId: 1,
        AccountID: 1,
        RefId: 1,
        Pcs: 10,
        Mtr: 50,
        Rate: 100,
        Amount: 5000,
        Plain: 1,
        Company: 'COMP1',
        BalPcs: 5,
        BalMtr: 25,
        CmpType: 'CMPTYPE1',
        SiteName: 'SITE1',
        SchdName: 'SCHD1',
        PurtrnId: 1,
        purchasePipeline: {} as PurchasePipeLine, // Added missing property
      } as SpTblFinishInWardOutWard;
      mockInWardOutWardProvider.getEntryByIdFromSPData.mockResolvedValue(mockEntry);

      const conum = '1'; // Changed to string to match service method signature
      const fdat = '2023-01-01';
      const tdat = '2023-01-31';
      const accountId = 'ACC1';
      const purTrnId = 1;

      const result = await service.GetEntrybyId(conum, fdat, tdat, accountId, purTrnId);

      expect(result).toEqual(mockEntry);
      expect(mockInWardOutWardProvider.getEntryByIdFromSPData).toHaveBeenCalledWith(
        conum, fdat, tdat, accountId, purTrnId
      );
    });
  });

  describe('InsetEntry', () => {
    it('should call create on the purchasePileLineProvider', async () => {
      // Corrected property names to match PurchasePipeLine entity
      const newData: Partial<PurchasePipeLine> = { Purtrnid: 1, Dat: new Date(), id: 1, Type: 1, Vno: 1, BillNo: 'B123', Customer: 'CUST1', City: 'CITY1', AgentName: 'AGN1', BillAmt: 100, Comapny: 'COMP1', LRNo: 'LRN1', Lrdat: new Date(), Entrydate: new Date(), UpdDate: new Date() }; // Use Purtrnid and Dat, added missing required properties
      const createdEntry: PurchasePipeLine = { ...newData } as PurchasePipeLine;
      mockPurchasePileLineProvider.create.mockResolvedValue(createdEntry);

      const result = await service.InsetEntry(newData);

      expect(result).toEqual(createdEntry);
      expect(mockPurchasePileLineProvider.create).toHaveBeenCalledWith(newData);
    });
  });

  describe('UpdateEntry', () => {
    it('should call update on the purchasePileLineProvider', async () => {
      const Purtrnid = 1; // Corrected property name
      // Corrected property names to match PurchasePipeLine entity
      const updateData: Partial<PurchasePipeLine> = { Dat: new Date() }; // Use Dat
      const updatedEntry: PurchasePipeLine = { Purtrnid, ...updateData, id: 1, Type: 1, Vno: 1, BillNo: 'B123', Customer: 'CUST1', City: 'CITY1', AgentName: 'AGN1', BillAmt: 100, Comapny: 'COMP1', LRNo: 'LRN1', Lrdat: new Date(), Entrydate: new Date(), UpdDate: new Date() } as PurchasePipeLine; // Added missing required properties
      mockPurchasePileLineProvider.update.mockResolvedValue(updatedEntry);

      const result = await service.UpdateEntry(Purtrnid, updateData);

      expect(result).toEqual(updatedEntry);
      expect(mockPurchasePileLineProvider.update).toHaveBeenCalledWith(Purtrnid, updateData);
    });
  });
});