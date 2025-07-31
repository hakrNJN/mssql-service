import FeaturesService from '../services/feature.service';
import PublisherRabbitMQService from '../services/publisher.RabbitMQ.service';
import RabbitMQClientService from '../services/rabbitMQ.service';
import { ILogger } from '../interface/logger.interface';
declare class EventDrivenController {
    private rabbitMQClient;
    private publisherService;
    private featuresService;
    private readonly logger;
    constructor(rabbitMQClient: RabbitMQClientService, publisherService: PublisherRabbitMQService, featuresService: FeaturesService, // Inject FeaturesService
    logger: ILogger);
    initialize(): Promise<void>;
    startEventListeners(): Promise<void>;
    private fetchData;
    private fetchRegister;
    private getRegisterDataById;
    close(): Promise<void>;
}
export default EventDrivenController;
