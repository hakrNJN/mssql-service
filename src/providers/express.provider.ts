//src/providers/express.provider.ts
import { injectable } from 'tsyringe';
import cors from 'cors';
import express, { Application } from 'express';
import helmet from 'helmet';

@injectable()
export default class ExpressApp {
    public app: Application;

     constructor() {
        this.app = express();
        this.initializeMiddleware();
     }
    
     private initializeMiddleware(): void {
        this.app.use(helmet());
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
     }
}
