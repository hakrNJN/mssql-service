import { NextFunction, Request, Response } from 'express'; // Import express types
import { IFeatureController } from '../interface/feature.interface';
import FeaturesService from '../services/feature.service';

class FeatureController implements IFeatureController {
    private featuresService: FeaturesService;
    private handlers: { [method: string]: (req: Request, res: Response) => Promise<void> }; // Explicit handler type

    constructor(featuresService: FeaturesService) {
        this.featuresService = featuresService;
        this.handleRequest = this.handleRequest.bind(this); // Bind if you need 'this' context
        this.handlers = {
            'GET': this.#getFeatures.bind(this), // Bind 'this' context
            'POST': this.#addFeatures.bind(this),
            'PUT': this.#editFeatures.bind(this),
            'DELETE': this.#deleteFeatures.bind(this)
        };
    }

    async handleRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            await this.featuresService.fileService.initialize(); // Re-initialize for each request if you want live file changes (not recommended for performance in prod)
            const { method } = req;

            if (this.handlers[method]) {
                await this.handlers[method](req, res);
            } else {
                throw new Error('Invalid request method');
            }
        } catch (error) {
            next(error);
        }
    }

    async #getFeatures(req: Request, res: Response): Promise<void> {
        const data = this.featuresService.fileService.model.read();
        res.json({ success: true, data });
    }

    async #addFeatures(req: Request, res: Response): Promise<void> {
        const { servicename, value } = req.body; // Assuming value is boolean
        if (typeof value !== 'boolean' || !servicename) {
            res.status(400).json({ success: false, message: 'Invalid request body. servicename (string) and value (boolean) are required.' });
            return;
        }
        try {
            this.featuresService.fileService.model.add(servicename, value);
            await this.featuresService.fileService.save();
            res.json({ success: true });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message }); // Send error message to client
        }
    }

    async #editFeatures(req: Request, res: Response): Promise<void> {
        const { servicename, value } = req.body; // Assuming value is boolean
        if (typeof value !== 'boolean' || !servicename) {
            res.status(400).json({ success: false, message: 'Invalid request body. servicename (string) and value (boolean) are required.' });
            return;
        }
        try {
            this.featuresService.fileService.model.edit(servicename, value);
            await this.featuresService.fileService.save();
            res.json({ success: true });
        } catch (error: any) {
            res.status(404).json({ success: false, message: error.message }); // Key not found error
        }
    }

    async #deleteFeatures(req: Request, res: Response): Promise<void> {
        const { servicename } = req.body;
        if (!servicename) {
            res.status(400).json({ success: false, message: 'Invalid request body. servicename (string) is required.' });
            return;
        }
        try {
            this.featuresService.fileService.model.delete(servicename);
            await this.featuresService.fileService.save();
            res.json({ success: true });
        } catch (error: any) {
            res.status(404).json({ success: false, message: error.message }); // Key not found error
        }
    }
}

export default FeatureController;