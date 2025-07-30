// src/tests/controllers/purchasePipeLine.controller.test.ts
import { Request, Response } from 'express';
import { PurchasePipeLineController } from '../../controllers/purchasePipeLine.controller';
import { PurchaseParcelStatusService } from '../../services/PurchaseInwardOutWard.service';
import { ApiResponse } from '../../utils/api-response';
import { HttpException } from '../../exceptions/httpException';
import { SpTblFinishInWardOutWard } from '../../entity/anushree/SpTblFinishInWardOutWard.entity';
import { PurchasePipeLine } from '../../entity/phoenix/PurchasePipeLine';

// Mock PurchaseParcelStatusService and ApiResponse
jest.mock('../../services/PurchaseInwardOutWard.service');
jest.mock('../../utils/api-response');

describe('PurchasePipeLineController', () => {
  let controller: PurchasePipeLineController;
  let mockService: jest.Mocked<PurchaseParcelStatusService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockService = new PurchaseParcelStatusService(null as any) as jest.Mocked<PurchaseParcelStatusService>;
    controller = new PurchasePipeLineController(mockService);
    mockRequest = {
      query: {},
      params: {},
      body: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getEntriesByFilter', () => {
    it('should return data on success', async () => {
      mockRequest.query = { company: 'C1', startDate: '2023-01-01', endDate: '2023-12-31', customer: 'Cust1' };
      const mockData: SpTblFinishInWardOutWard[] = [
        {
          Conum: 1,
          Type: 1,
          Vno: 1,
          Dat: new Date(),
          BillNo: 'B1',
          Series: 'S1',
          LRCase: 1,
          LRNo: 'LR1',
          Transport: 'T1',
          Customer: 'Cust1',
          Category: 'Cat1',
          GRPName: 'G1',
          Add1: 'A1',
          Add2: 'A2',
          City: 'C1',
          State: 'S1',
          Mobile: 'M1',
          Phone: 'P1',
          ConsPerson: 'CP1',
          BillAmount: 100,
          NetAmt: 90,
          Qualid: 1,
          Baseid: 1,
          Item: 'I1',
          Quality: 'Q1',
          DesignNo: 'D1',
          AgentName: 'AN1',
          AgentCity: 'AC1',
          TrnMode: 'TM1',
          TrnOrigin: 'TO1',
          Book: 'B1',
          AgentId: 1,
          AccountID: 1,
          RefId: 1,
          Pcs: 10,
          Mtr: 100,
          Rate: 10,
          Amount: 1000,
          Plain: 1,
          Company: 'Comp1',
          CAdd1: 'CA1',
          CAdd2: 'CA2',
          BalPcs: 5,
          BalMtr: 50,
          CmpType: 'CT1',
          SiteName: 'SN1',
          SchdName: 'SCN1',
          PurtrnId: 1,
          purchasePipeline: {} as PurchasePipeLine,
        },
      ];
      mockService.getEntriesByFilter.mockResolvedValue(mockData);

      await controller.getEntriesByFilter(mockRequest as Request, mockResponse as Response);

      expect(mockService.getEntriesByFilter).toHaveBeenCalled();
      expect(ApiResponse.success).toHaveBeenCalledWith({
        res: mockResponse,
        req: mockRequest,
        data: mockData,
        message: 'Purchase pipeline entries retrieved successfully',
      });
    });

    it('should throw NotFound if no data is found', async () => {
      mockRequest.query = { company: 'C1', startDate: '2023-01-01', endDate: '2023-12-31', customer: 'Cust1' };
      mockService.getEntriesByFilter.mockResolvedValue([]);

      await expect(controller.getEntriesByFilter(mockRequest as Request, mockResponse as Response)).rejects.toThrow(
        HttpException.NotFound('No purchase pipeline entries found matching criteria.')
      );
    });
  });

  describe('getEntryById', () => {
    it('should return data on success', async () => {
      mockRequest.params = { purTrnId: '1' };
      mockRequest.query = { company: 'C1', startDate: '2023-01-01', endDate: '2023-12-31', customer: 'Cust1' };
      const mockData: SpTblFinishInWardOutWard = {
        Conum: 1,
        Type: 1,
        Vno: 1,
        Dat: new Date(),
        BillNo: 'B1',
        Series: 'S1',
        LRCase: 1,
        LRNo: 'LR1',
        Transport: 'T1',
        Customer: 'Cust1',
        Category: 'Cat1',
        GRPName: 'G1',
        Add1: 'A1',
        Add2: 'A2',
        City: 'C1',
        State: 'S1',
        Mobile: 'M1',
        Phone: 'P1',
        ConsPerson: 'CP1',
        BillAmount: 100,
        NetAmt: 90,
        Qualid: 1,
        Baseid: 1,
        Item: 'I1',
        Quality: 'Q1',
        DesignNo: 'D1',
        AgentName: 'AN1',
        AgentCity: 'AC1',
        TrnMode: 'TM1',
        TrnOrigin: 'TO1',
        Book: 'B1',
        AgentId: 1,
        AccountID: 1,
        RefId: 1,
        Pcs: 10,
        Mtr: 100,
        Rate: 10,
        Amount: 1000,
        Plain: 1,
        Company: 'Comp1',
        CAdd1: 'CA1',
        CAdd2: 'CA2',
        BalPcs: 5,
        BalMtr: 50,
        CmpType: 'CT1',
        SiteName: 'SN1',
        SchdName: 'SCN1',
        PurtrnId: 1,
        purchasePipeline: {} as PurchasePipeLine,
      };
      mockService.GetEntrybyId.mockResolvedValue(mockData);

      await controller.getEntryById(mockRequest as Request, mockResponse as Response);

      expect(mockService.GetEntrybyId).toHaveBeenCalled();
      expect(ApiResponse.success).toHaveBeenCalledWith({
        res: mockResponse,
        req: mockRequest,
        data: mockData,
        message: 'Purchase pipeline entry retrieved for PurTrnId: 1',
      });
    });
  });

  describe('insertEntry', () => {
    it('should return created data on success', async () => {
      const mockData: PurchasePipeLine = {
        id: 1,
        Purtrnid: 1,
        Type: 1,
        Vno: 1,
        Dat: new Date(),
        BillNo: 'B1',
        Customer: 'C1',
        City: 'City1',
        GroupName: 'G1',
        AgentName: 'A1',
        BillAmt: 100,
        Comapny: 'Comp1',
        LRNo: 'LR1',
        Lrdat: new Date(),
        ReceiveDate: new Date(),
        OpenDate: new Date(),
        Entrydate: new Date(),
        UpdDate: new Date(),
        finishInWards: [],
      };
      mockService.InsetEntry.mockResolvedValue(mockData);

      mockRequest.body = {
        Purtrnid: 1,
        Type: 1,
        Vno: 1,
        Dat: new Date(),
      };
      await controller.insertEntry(mockRequest as Request, mockResponse as Response);

      expect(mockService.InsetEntry).toHaveBeenCalledWith(mockRequest.body);
      expect(ApiResponse.success).toHaveBeenCalledWith({
        res: mockResponse,
        req: mockRequest,
        data: mockData,
        message: 'Purchase pipeline entry created successfully',
        statusCode: 201,
      });
    });
  });

  describe('updateEntry', () => {
    it('should return success on update', async () => {
      mockRequest.params = { purTrnId: '1' };
      mockRequest.body = { Vno: 2 };
      mockService.UpdateEntry.mockResolvedValue({ id: 1, Vno: 2 } as any);

      await controller.updateEntry(mockRequest as Request, mockResponse as Response);

      expect(mockService.UpdateEntry).toHaveBeenCalledWith(1, mockRequest.body);
      expect(ApiResponse.success).toHaveBeenCalledWith({
        res: mockResponse,
        req: mockRequest,
        data: { updated: true },
        message: 'Purchase pipeline entry updated for PurTrnId: 1',
      });
    });
  });
});