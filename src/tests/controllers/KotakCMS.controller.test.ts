// src/tests/controllers/KotakCMS.controller.test.ts
import { Request, Response } from 'express';
import { KotakCMSController } from '../../controllers/kotakCMS.controller';
import { HttpException } from '../../exceptions/httpException';
import { KotakCMSService } from '../../services/kotakCMS.service';
import { ApiResponse } from '../../utils/api-response';
import { Vwkotakcmsonline } from '../../entity/anushreeDb/kotakCMS.entity';
import { ILogger } from '../../interface/logger.interface';

// Mock KotakCMSService and ApiResponse
jest.mock('../../services/kotakCMS.service');
jest.mock('../../utils/api-response');

describe('KotakCMSController', () => {
  let controller: KotakCMSController;
  let mockService: jest.Mocked<KotakCMSService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockLogger: jest.Mocked<ILogger>;

  beforeEach(() => {
    mockLogger = { info: jest.fn(), error: jest.fn(), warn: jest.fn(), debug: jest.fn() } as jest.Mocked<ILogger>;
    mockService = new KotakCMSService(null as any, null as any) as jest.Mocked<KotakCMSService>; // Updated to match new constructor
    controller = new KotakCMSController(mockService, mockLogger);
    mockRequest = {
      query: {},
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

  describe('getAllKotakCMS', () => {
    it('should return data on success', async () => {
      mockRequest.query = { fromVno: '1', toVno: '10', conum: 'C1', yearid: '2023', page: '1', limit: '10' };
      const mockData: Vwkotakcmsonline[] = [
        {
          vno: 1,
          Conum: 'C1',
          Client_Code: 'CC1',
          Product_Code: 'PC1',
          Payment_Type: 'PT1',
          Payment_Ref_No: 'PRN1',
          Payment_Date: new Date(),
          Amount: 100,
          Instrument_Date: new Date(),
          Dr_Ac_No: 'DR1',
          Bank_Code_Indicator: 'BCI1',
          Beneficiary_Code: 'BC1',
          Beneficiary_Name: 'BN1',
          Beneficiary_Bank: 'BB1',
          Beneficiary_Branch_IFSC_Code: 'BBIC1',
          Beneficiary_Acc_No: 'BAN1',
          Location: 'L1',
          Print_Location: 'PL1',
          Instrument_Number: 'IN1',
          Ben_Add1: 'BA1',
          Ben_Add2: 'BA2',
          Ben_Add3: 'BA3',
          Ben_Add4: 'BA4',
          Beneficiary_Email: 'BE1',
          Beneficiary_Mobile: 'BM1',
          Debit_Narration: 'DN1',
          Credit_Narration: 'CN1',
          Payment_Details_1: 'PD1',
          Payment_Details_2: 'PD2',
          Payment_Details_3: 'PD3',
          Payment_Details_4: 'PD4',
          Enrichment_1: 'E1',
          Enrichment_2: 'E2',
          Enrichment_3: 'E3',
          Enrichment_4: 'E4',
          Enrichment_5: 'E5',
          Enrichment_6: 'E6',
          Enrichment_7: 'E7',
          Enrichment_8: 'E8',
          Enrichment_9: 'E9',
          Enrichment_10: 'E10',
          Enrichment_11: 'E11',
          Enrichment_12: 'E12',
          Enrichment_13: 'E13',
          Enrichment_14: 'E14',
          Enrichment_15: 'E15',
          Enrichment_16: 'E16',
          Enrichment_17: 'E17',
          Enrichment_18: 'E18',
          Enrichment_19: 'E19',
          Enrichment_20: 'E20',
          
          Type: 1,
          YearId: 2023,
          seriesMaster: { id: 1, seriesName: 'Mock Series', YearId: 2023 } as any, // Mock SerMst object
        },
      ];
      mockService.getKotakCMSData.mockResolvedValue(mockData);

      await controller.getAllKotakCMS(mockRequest as Request, mockResponse as Response);

      expect(mockService.getKotakCMSData).toHaveBeenCalledWith(1, 10, 'C1', 2023, 0, 10);
      expect(ApiResponse.success).toHaveBeenCalledWith({
        res: mockResponse,
        req: mockRequest,
        data: mockData,
        message: 'Kotak CMS records retrieved successfully',
      });
    });

    it('should throw BadRequest if required params are missing', async () => {
      await expect(controller.getAllKotakCMS(mockRequest as Request, mockResponse as Response)).rejects.toThrow(
        HttpException.BadRequest('Missing required query parameters: fromVno, toVno, conum, yearid.')
      );
    });

    it('should throw NotFound if no data is found', async () => {
      mockRequest.query = { fromVno: '1', toVno: '10', conum: 'C1', yearid: '2023' };
      mockService.getKotakCMSData.mockResolvedValue([]);

      await expect(controller.getAllKotakCMS(mockRequest as Request, mockResponse as Response)).rejects.toThrow(
        HttpException.NotFound('No Kotak CMS records found matching criteria.')
      );
    });

    it('should throw InternalServerError on service error', async () => {
      mockRequest.query = { fromVno: '1', toVno: '10', conum: 'C1', yearid: '2023' };
      const error = new Error('Service error');
      mockService.getKotakCMSData.mockRejectedValue(error);

      await expect(controller.getAllKotakCMS(mockRequest as Request, mockResponse as Response)).rejects.toThrow(
        HttpException.InternalServerError('Something Went Wrong while fetching Kotak CMS records', error)
      );
    });
  });
});