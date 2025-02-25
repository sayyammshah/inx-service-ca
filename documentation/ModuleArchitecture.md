# Core Module

### Business

- **EntityManager**
- **RulesEngine**

### Applications

- **CreateUser**
- **UpdateUser**
- **CreateInsight**
- **AddComment**
- **AddReply**
- **AddLike**
- **AddDislike**

### Interfaces (Ports)

- **StorageInterface**
  - InsertDocument
  - UpdateDocument
  - DeleteDocument
  - FindDocuments
  - FindDocumentById

### Common

- `constants.ts`
- `utils.ts`
- `errors.ts`
- `logger.ts`
- `types.d.ts`

# Bindings Module

### Inbound Bindings

#### Routes

- **User**
  - Create (POST)
  - Update (PATCH)
  - Read (GET)
- **Insight**
  - Create (POST)
  - Read (GET)
  - Update (PATCH)
  - Delete (DELETE) // Optional

#### Controllers

- **CreateUser**
- **UpdateUser**
- **GetUser**
- **CreateInsight**
- **GetInsight** - (Get Insight & Get Comments - aggregate, process, and respond)
- **DeleteInsight**
- **UpdateInsight**
  - AddComment
  - AddReply
  - AddLike
  - AddDislike

#### Middlewares

- **AuthMiddleware**
- **ErrorMiddleware**
- **LoggerMiddleware**

#### Schemas (ZOD Validations)

- **Users**
- **Insights**
- **Comments**

### Outbound Bindings

#### Storage

- **MongoDB**
  - `InsertDocumentStorage` → Implements → `InsertDocument`
  - `UpdateDocumentStorage` → Implements → `UpdateDocument`
  - `DeleteDocumentStorage` → Implements → `DeleteDocument`
  - `FindDocumentsStorage` → Implements → `FindDocuments`
  - `FindDocumentByIdStorage` → Implements → `FindDocumentById`

### Common

- **ResponseClass**
- **Models**
- **Constants**
- **Utils**
- **Errors**
- **Types**

# Infrastructure Module

### Config

- `app.config.ts`
- `mongodb.config.ts`
- `redis.config.ts`

### Clients

- **MongodbClient**
- **RedisClient**

### Common

- **CryptoManager**
- **LoggerManager**

# Shared Module

- **AppErrorsManager**
