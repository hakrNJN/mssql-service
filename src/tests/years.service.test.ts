// __tests__/years.service.test.ts
import { AppDataSource } from '../providers/data-source.provider';
import { YearsProvider } from '../providers/years.provider';
import { YearService } from '../services/years.service';

jest.mock('../providers/years.provider', () => {
    return {
        YearsProvider: jest.fn().mockImplementation(() => ({
            initializeRepository: jest.fn(),
            getAllYears: jest.fn(),
            getYearById: jest.fn(),
            getAllYearsWithFilters: jest.fn()
        })),
    };
});

describe('YearService', () => {
    let service: YearService;
    let mockYearsProvider: any;
    let mockDataSource: any;

    beforeEach(() => {
        mockDataSource = new AppDataSource();
        service = new YearService(mockDataSource);
        mockYearsProvider = new YearsProvider(mockDataSource);
    });

    it('should get all years successfully', async () => {
        const mockYears = [{ id: 1, year: 2023 }, { id: 2, year: 2024 }];
        (YearsProvider as jest.Mock).mockImplementation(() => {
            return {
                initializeRepository: jest.fn(),
                getAllYears: jest.fn().mockResolvedValue(mockYears),
                getYearById: jest.fn(),
                getAllYearsWithFilters: jest.fn()
            }
        });
        const yearsProviderInstance = new YearsProvider(mockDataSource)
        service = new YearService(mockDataSource);
        const years = await service.getYears();

        expect(yearsProviderInstance.getAllYears).toHaveBeenCalled();
        expect(years).toEqual(mockYears);
    });

    it('should get a year by ID successfully', async () => {
        const mockYear = { id: 1, year: 2023 };
        (YearsProvider as jest.Mock).mockImplementation(() => {
            return {
                initializeRepository: jest.fn(),
                getAllYears: jest.fn(),
                getYearById: jest.fn().mockResolvedValue(mockYear),
                getAllYearsWithFilters: jest.fn()
            }
        });
        const yearsProviderInstance = new YearsProvider(mockDataSource)
        service = new YearService(mockDataSource);

        const year = await service.getYearsById(1);
        expect(yearsProviderInstance.getYearById).toHaveBeenCalledWith(1);
        expect(year).toEqual(mockYear);
    });
});
