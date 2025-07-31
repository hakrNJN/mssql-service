import { Request, Response } from 'express';
import { SeriesService } from '../services/series.service';
export interface SeriesController {
    stringToArray(str: string): number[];
}
export declare class SeriesController {
    private seriesService;
    constructor(seriesService: SeriesService);
    getAllSeries: (req: Request, res: Response) => Promise<void>;
    getSeriesById: (req: Request, res: Response) => Promise<void>;
    getIrnSeries: (req: Request, res: Response) => Promise<void>;
}
