# Improved eInvoice Generation Microservice Flow (Using RabbitMQ)

## Core Concepts

- **Batch Processing**: Process requests in batches (identified by `BatchNo`) for efficient handling of multiple vouchers from a user.
- **Correlation IDs**: Use `BatchNo` and `TransactionId` consistently in messages for tracking and status updates.
- **Explicit Error Handling**: Incorporate retry mechanisms and dead-letter queues for robust error management.
- **Granular Status Updates**: Send more detailed status updates to the frontend for a better user experience.
- **Idempotency**: Design services to handle duplicate messages gracefully.
- **Dedicated WebSocket Service**: Separate WebSocket handling into its own service for better separation of concerns.

## Rewritten Flow Steps

### 1. Frontend Request & IRN Service (HTTP Endpoint & Message Publishing)

1. **Action**: Frontend sends an HTTP request to the IRN Service with a list of `Voucher IDs` for eInvoice generation.
2. **IRN Service Logic**:
   - Receives the HTTP request.
   - Assigns (or uses the provided) `BatchNo`.
   - For each `TransactionId`:
     - Creates a message with `TransactionId` and `BatchNo`.
     - Publishes the message to `fetch_data_queue` (Direct Exchange, routing key: `fetch.data`).
3. **Immediate HTTP Response**:
   - Status: "Request Accepted"
   - `BatchNo`: Assigned batch number for tracking.
   - List of `TransactionIds` included.

### 2. SQL Data Fetch Service (Data Retrieval and Message Publishing)

1. **Queue Consumption**: Service consumes messages from `fetch_data_queue`.
2. **Data Fetching Logic**:
   - Attempts to retrieve data from the SQL database.
   - **Error Handling** (if data retrieval fails):
     - Publishes a status message to `status_queue` (Topic Exchange, `status.data_fetch_failed`).
   - **Data Retrieval Success**:
     - Publishes data to `data_queue` (Direct Exchange, routing key: `process.data`).
     - Updates `status_queue` with `status.data_fetched`.

### 3. IRN Validation & Processing Service (Validation, E-Invoice Generation)

1. **Queue Consumption**: Service consumes messages from `data_queue`.
2. **Validation Logic**:
   - **Validation Success**:
     - Publishes valid data to `validation_success_queue` (`generate.einvoice`).
     - Updates `status_queue` (`status.validation_success`).
   - **Validation Failure**:
     - Publishes invalid data to `validation_error_queue` (`handle.validation_error`).
     - Updates `status_queue` (`status.validation_failed`).

### 4. E-Invoice Generation & Registration Service

1. **Queue Consumption**: Service consumes messages from `validation_success_queue`.
2. **E-Invoice Generation Logic**:
   - **Registration Success**:
     - Publishes success message to `register_success_queue` (`db.update.success`).
     - Updates `status_queue` (`status.generation_success`).
   - **Registration Failure**:
     - Publishes error message to `invalid_generation_queue` (`handle.generation_error`).
     - Updates `status_queue` (`status.generation_failed`).

### 5. SQL Database Update Service

1. **Queue Consumption**: Service consumes messages from `register_success_queue`.
2. **Database Update Logic**:
   - Updates SQL database to mark `TransactionId` as "eInvoice Registered".
   - Updates `status_queue` (`status.db_updated`).

### 6. Frontend WebSocket Service

1. **Queue Consumption**: Service consumes messages from `status_queue`.
2. **WebSocket Push Logic**:
   - Extracts `TransactionId`, `BatchNo`, and `Status`.
   - Pushes status updates to the frontend via WebSocket.

### 7. Frontend UI Update (Real-time)

- UI updates dynamically based on WebSocket messages.
- Status updates include transitions like:
  - `Processing` → `Data Fetched` → `Validation Success` → `E-Invoice Registered`.
  - Errors: `Data Fetch Failed`, `Validation Failed`, `Generation Failed`.

## RabbitMQ Configuration

### **Exchanges**

- **Direct Exchange** (`direct_exchange`): For point-to-point queue routing.
- **Topic Exchange** (`status_exchange`): For status message routing.

### **Queues**

- `fetch_data_queue` → (`fetch.data`)
- `data_queue` → (`process.data`)
- `validation_success_queue` → (`generate.einvoice`)
- `validation_error_queue` → (`handle.validation_error`)
- `register_success_queue` → (`db.update.success`)
- `invalid_generation_queue` → (`handle.generation_error`)
- `status_queue` → (`#` for all status messages)

## **Improvements Highlighted**

- **Explicit Error Queues**: Separate success and error queues.
- **Detailed Status Updates**: Granular messages for better UI feedback.
- **Dedicated WebSocket Service**: Enhances modularity and scalability.
- **Topic Exchange for Status**: Enables flexible status message routing.
- **Clear Routing Keys**: Improves message flow understanding.
- **Idempotency & Retries**: Designed for duplicate message handling.
- **Data Fetch Failure Handling**: Prevents invalid data from proceeding.

## **Next Steps for Implementation**

1. **Queue and Exchange Setup** in RabbitMQ.
2. **Microservice Implementation** following flow logic.
3. **Status Tracking & Frontend Integration** with WebSocket.
4. **Error Handling & Monitoring** (Retries, Dead-lettering, Logging).
5. **Testing** all success and failure scenarios.
