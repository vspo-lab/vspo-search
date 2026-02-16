# Server Architecture

## Overview

The server is designed based on the principles of **Clean Architecture** and **Domain-Driven Design (DDD)**.
It adopts the Hexagonal Architecture (Ports & Adapters) pattern to isolate business logic from external systems.

## Directory Structure

### API Server (Hono)

```
services/api/
├── domain/              # Domain layer - Business logic
├── usecase/             # Use case layer - Application logic
├── infra/               # Infrastructure layer - External system connections
│   ├── di/              # Dependency injection container
│   ├── repository/      # Data access layer
│   ├── http/            # HTTP/REST API
│   ├── ai/              # AI service integration
│   ├── pubsub/          # Messaging (Google Cloud Pub/Sub)
│   ├── email/           # Email service (Resend)
│   ├── firebase/        # Firebase authentication
│   └── stripe/          # Stripe payments
├── cmd/                 # Entry point
└── pkg/                 # Shared utilities
```

### Transcriptor Service (Cloudflare Worker)

The same layered structure is applied for the Cloudflare Worker.
The shared package `@vspo/errors` is used to provide unified error handling via the Result type.

```
services/transcriptor/
├── ytdlp/                  # Go server inside the container
│   └── main.go            # Command execution + JSON response
└── src/
    ├── domain/
    │   └── transcript.ts       # Zod Schema + TranscriptKey Companion Object
    ├── usecase/
    │   └── transcript.ts       # TranscriptUseCase.from(ports) → fetch / saveRaw
    ├── infra/
    │   ├── container/
    │   │   └── ytdlp.ts        # YtdlpContainer DO + TranscriptFetcher
    │   ├── http/
    │   │   ├── app.ts          # Hono app composition
    │   │   ├── route-inngest.ts
    │   │   ├── route-transcript.ts
    │   │   └── route-workflow.ts
    │   ├── inngest/
    │   │   ├── client.ts       # Inngest client + Hono bindings middleware
    │   │   └── functions/
    │   │       └── process-transcript.ts # Event-driven transcript processing
    │   ├── repository/
    │   │   ├── job.ts          # D1 JobRepository for processing status
    │   │   └── transcript.ts   # R2 TranscriptRepository (wrapped with Result via wrap)
    │   ├── usecase/
    │   │   └── transcript.ts   # Infra adapters wired into usecase ports
    │   └── workflow/
    │       └── transcript-workflow.ts  # Cloudflare Workflow (step-based execution)
    └── index.ts                # Entry point + HTTP routes
```

**Worker-specific design principles:**

- **UseCase depends on ports**: `TranscriptUseCase.from(ports)` has no infra imports
- **Infra composes dependencies**: `createTranscriptUseCase()` wires fetcher + repository
- **Workflow calls UseCase**: Executes usecase `fetch()` + `saveRaw()` within steps
- **HTTP handler also calls UseCase**: Shares the same business logic
- **Env bindings replace DI**: `this.env.YT_CONTAINER`, `this.env.TRANSCRIPT_BUCKET`
- **Repository uses factory pattern**: `TranscriptRepository.from(bucket)` injects the R2 bucket
- **Unified via Result type**: `@vspo/errors` `Result<T, AppError>` + `wrap()` used across all layers
- **Domain layer is pure**: Zod Schema + Companion Object, no external dependencies

```typescript
// Example of Result chaining through usecase ports
const fetchResult = await usecase.fetch(params);
if (fetchResult.err) return fetchResult;  // Propagate AppError
return usecase.saveRaw(params, fetchResult.val);
```

## Layer Structure

```
┌─────────────────────────────────────────────────────────────┐
│                     HTTP Handlers                            │
│                   (Hono + OpenAPI)                          │
└───────────────────────┬─────────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                    Use Case Layer                            │
│                (Application logic)                           │
└───────────────────────┬─────────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                    Domain Layer                              │
│                 (Business logic)                             │
└───────────────────────┬─────────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                 Infrastructure Layer                         │
│        (Repository, AI Service, Pub/Sub, etc.)              │
└─────────────────────────────────────────────────────────────┘
```

## Design Principles

### 1. Dependency Inversion Principle (DIP)

- Higher layers do not depend on lower layers
- Depend on abstractions (type definitions), not on concrete implementations
- The domain layer has no dependencies on other layers

```typescript
// UseCase depends on Repository types (abstractions)
type Dependencies = Readonly<{
  userRepository: UserRepository;  // Type definition
  txManager: TxManager;
}>;

// Concrete implementations are injected via the DI container
const userUseCase = UserUseCase.from({
  userRepository: UserRepository,  // Implementation
  txManager: TxManager,
});
```

### 2. Error Handling with Result Type

Instead of `try-catch`, all errors are expressed using `Result<T, E>`.

```typescript
// Result type definition
type Result<T, E extends BaseError> = OkResult<T> | ErrResult<E>;

// Usage example
const userResult = await userRepository.from({ tx }).getById(userId);
if (userResult.err) {
  return userResult;  // Propagate the error
}
const user = userResult.val;  // Value on success
```

**Benefits:**
- Error flow is explicit
- The type system enforces error handling
- Unexpected exceptions are less likely to occur

### 3. Zod Schema First

All type definitions are derived from Zod schemas.

```typescript
// The schema is the source of truth for types
const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  // ...
});

// Types are inferred from schemas
type User = z.infer<typeof userSchema>;
```

### 4. Immutable Updates

Domain objects are immutable, and update operations return new objects.

```typescript
// Update the current user and return a new user
const updatedUser = User.update(user, { displayName: "New Name" });
const completedTask = Task.complete(task);
```

---

## Domain Layer

### Aggregates

The DDD aggregate pattern is used to group related entities.

```
domain/
├── user/                    # User aggregate
│   ├── user.ts             # User (aggregate root)
│   ├── user-profile.ts     # UserProfile (value object)
│   ├── user-usage.ts       # UserUsage (value object)
│   └── user-settings.ts    # UserSettings (value object)
├── [your-domain]/           # Application-specific aggregate
│   ├── [aggregate-root].ts  # Aggregate root
│   ├── [entity].ts          # Child entity
│   └── [value-object].ts    # Value object
├── billing/                 # Billing aggregate
│   ├── subscription.ts     # Subscription (aggregate root)
│   └── payment-history.ts  # PaymentHistory (entity)
├── inquiry/                 # Inquiry aggregate
│   └── inquiry.ts          # Inquiry (aggregate root)
├── email/                   # Email aggregate
│   └── email.ts            # Email (entity)
└── [reference-data].ts     # Reference data (master data, etc.)
```

### Companion Object Pattern

Domain models have a companion object with the same name that holds factory methods and business logic.

```typescript
// Type definition
const userSchema = z.object({ ... });
export type User = z.infer<typeof userSchema>;

// Companion object (domain logic)
export const User = {
  new: (props: CreateUserProps): User => { ... },
  update: (user: User, props: UpdateProps): User => { ... },
  recordLogin: (user: User): User => { ... },
} as const;
```

### Discriminated Union

Value objects with complex state are expressed using Discriminated Unions.

```typescript
// UserProfile has different types based on role
type AdminProfile = {
  role: "admin";
  permissions: string[];
  department: string | null;
  // ...
};

type RegularUserProfile = {
  role: "user";
  preferences: Record<string, unknown>;
  // ...
};

type UserProfile = AdminProfile | RegularUserProfile | GuestProfile;

// Type guards
export const UserProfile = {
  isAdmin: (profile: UserProfile): profile is AdminProfile =>
    profile.role === "admin",
  isRegularUser: (profile: UserProfile): profile is RegularUserProfile =>
    profile.role === "user",
} as const;
```

---

## UseCase Layer

### Dependency Injection via Factory Pattern

```typescript
type Dependencies = Readonly<{
  userRepository: UserRepository;
  txManager: TxManager;
}>;

type UserUseCaseType = Readonly<{
  from: (deps: Dependencies) => Readonly<{
    getUserById: (input: GetUserInput) => Promise<Result<User, AppError>>;
    updateUser: (input: UpdateUserInput) => Promise<Result<User, AppError>>;
  }>;
}>;

export const UserUseCase = {
  from: ({ userRepository, txManager }: Dependencies) => ({
    getUserById: async ({ userId }) => {
      return await txManager.runTx(async (tx) => {
        return await userRepository.from({ tx }).getById(userId);
      });
    },
    // ...
  }),
} as const satisfies UserUseCaseType;
```

### Transaction Management

All database operations are wrapped in transactions using `txManager.runTx()`.

```typescript
return await txManager.runTx(async (tx) => {
  // Multiple repository operations execute within the same transaction
  const taskRepo = taskRepository.from({ tx });
  const userRepo = userRepository.from({ tx });

  const taskResult = await taskRepo.complete(task);
  if (taskResult.err) return taskResult;

  const userResult = await userRepo.incrementUsageCount(user);
  if (userResult.err) return userResult;

  return Ok(result);
});
```

### Orchestrating Composite Operations

The UseCase coordinates multiple domain and repository operations.

```typescript
// TaskUseCase.completeTask
return await txManager.runTx(async (tx) => {
  // 1. Update the task to completed status
  const completedTask = Task.complete(task);
  await taskRepo.update(completedTask);

  // 2. Increment the user's usage count
  const updatedUser = User.incrementUsageCount(user);
  await userRepo.update(updatedUser);

  // 3. Create a placeholder for results
  const pendingResult = Result.createPending({ taskId });
  await resultRepo.create(pendingResult);

  // 4. Publish an async processing task
  await pubsubClient.publishProcessingTask({ taskId, resultId });

  return Ok(result);
});
```

---

## Infrastructure Layer

### Repository Pattern

Repositories receive transactions via the factory pattern.

```typescript
type Dependencies = Readonly<{ tx: Transaction }>;

export type UserRepository = Readonly<{
  from: (deps: Dependencies) => Readonly<{
    create: (user: User) => Promise<Result<User, AppError>>;
    getById: (id: string) => Promise<Result<User, AppError>>;
    update: (user: User) => Promise<Result<User, AppError>>;
    delete: (id: string) => Promise<Result<User, AppError>>;
  }>;
}>;
```

### Method Naming Convention for Repository and UseCase

Use **primitive, short method names** when the context makes the operation self-evident.

#### Principle

Since the repository/usecase is already scoped to a specific domain (e.g., `FeedbackRepository`, `UserUseCase`), method names should not redundantly include the domain name.

#### Good Examples

```typescript
// FeedbackRepository - domain context is clear
export type FeedbackRepository = Readonly<{
  from: (deps: Dependencies) => Readonly<{
    create: (feedback: Feedback) => Promise<Result<Feedback, AppError>>;
    getById: (id: string) => Promise<Result<Feedback, AppError>>;
    update: (feedback: Feedback) => Promise<Result<Feedback, AppError>>;  // ✅ Not "updateFeedback"
    delete: (id: string) => Promise<Result<void, AppError>>;
  }>;
}>;

// UserUseCase - domain context is clear
const UserUseCase = {
  from: (deps: Dependencies) => ({
    getById: async (userId: string) => { ... },  // ✅ Not "getUserById"
    update: async (user: User) => { ... },       // ✅ Not "updateUser"
    delete: async (userId: string) => { ... },   // ✅ Not "deleteUser"
  }),
};
```

#### Bad Examples

```typescript
// ❌ Redundant - "Feedback" is already in the repository name
FeedbackRepository.updateFeedback(feedback);
FeedbackRepository.getFeedbackById(id);
FeedbackRepository.deleteFeedback(id);

// ❌ Redundant - "User" is already in the usecase name
UserUseCase.getUserById(id);
UserUseCase.updateUser(user);
```

#### Exceptions

When methods operate on **related but different entities**, include the entity name for clarity:

```typescript
// TaskRepository may also manage Steps
export type TaskRepository = Readonly<{
  from: (deps: Dependencies) => Readonly<{
    getById: (id: string) => Promise<Result<Task, AppError>>;
    update: (task: Task) => Promise<Result<Task, AppError>>;
    // Steps are related entities - include name for clarity
    getStepsByTaskId: (taskId: string) => Promise<Result<Step[], AppError>>;
    saveSteps: (taskId: string, steps: Step[]) => Promise<Result<void, AppError>>;
  }>;
}>;
```

#### Standard CRUD Method Names

| Operation | Method Name | Parameters |
|-----------|-------------|------------|
| Create | `create` | Domain object |
| Read by ID | `getById` | ID string |
| Read multiple | `list`, `getAll`, `findBy*` | Query params |
| Update | `update` | Domain object |
| Delete | `delete` | ID string |
| Check existence | `exists` | ID string |

#### Anti-pattern: Mixing Multiple Domains in One Repository

Do NOT combine multiple domain entities into a single repository. This forces redundant method names and violates single responsibility.

```typescript
// ❌ Bad - Multiple domains in one repository forces verbose naming
export type BillingRepository = Readonly<{
  from: (deps: Dependencies) => Readonly<{
    createSubscription: (subscription: Subscription) => Promise<...>;
    updateSubscription: (subscription: Subscription) => Promise<...>;
    createPaymentHistory: (payment: PaymentHistory) => Promise<...>;
    getPaymentHistoryByUserId: (userId: string) => Promise<...>;
  }>;
}>;

// ✅ Good - Separate repositories with clean naming
export type SubscriptionRepository = Readonly<{
  from: (deps: Dependencies) => Readonly<{
    create: (subscription: Subscription) => Promise<...>;
    update: (subscription: Subscription) => Promise<...>;
    getByUserId: (userId: string) => Promise<...>;
  }>;
}>;

export type PaymentHistoryRepository = Readonly<{
  from: (deps: Dependencies) => Readonly<{
    create: (payment: PaymentHistory) => Promise<...>;
    getByUserId: (userId: string, limit?: number) => Promise<...>;
  }>;
}>;
```

### Using drizzle-zod Schemas

For converting DB data to domain models, drizzle-zod generated schemas are used as DTOs.

```typescript
import { selectHighlightsSchema } from "./mysql/schema";

// Use drizzle-zod schema directly
return Ok(selectItemsSchema.parse(result.val[0]));

// Also used for child entities of aggregates
const toTaskAggregate = (task, steps) => ({
  ...task,
  steps: steps.map((row) => selectStepsSchema.parse(row)),
});
```

### Avoiding N+1 Queries

Related entities are fetched in bulk and grouped on the client side.

```typescript
// Good: Batch retrieval
const taskIds = tasks.map((t) => t.id);
const stepsResult = await tx
  .select()
  .from(stepsTable)
  .where(inArray(stepsTable.taskId, taskIds));

// Grouping
const stepsByTaskId = new Map<string, SelectStep[]>();
for (const step of stepsResult.val) {
  const existing = stepsByTaskId.get(step.taskId) ?? [];
  existing.push(step);
  stepsByTaskId.set(step.taskId, existing);
}

// Bad: N+1 queries
for (const task of tasks) {
  const steps = await tx
    .select()
    .from(stepsTable)
    .where(eq(stepsTable.taskId, task.id));
}
```

### Aggregate Persistence

The aggregate root and its child entities are saved atomically.

```typescript
saveAggregate: async (task: Task) => {
  // 1. Update the task header
  await tx.update(tasksTable)
    .set({ status: task.status, ... })
    .where(eq(tasksTable.id, task.id));

  // 2. Delete existing steps
  await tx.delete(stepsTable)
    .where(eq(stepsTable.taskId, task.id));

  // 3. Insert new steps
  if (task.steps.length > 0) {
    await tx.insert(stepsTable)
      .values(task.steps.map(step => ({ ... })));
  }

  return Ok(task);
}
```

---

## Dependency Injection (DI)

### Manual Factory-based DI

The container is built manually without external DI frameworks.

```typescript
// infra/di/container.ts
export const createContainer = (): Container => {
  // 1. Instantiate infrastructure layer
  const txManager = TxManager;
  const userRepository = UserRepository;
  const feedbackRepository = FeedbackRepository;

  // 2. Instantiate use case layer (inject dependencies)
  const userUseCase = UserUseCase.from({
    userRepository,
    txManager,
  });

  const taskUseCase = TaskUseCase.from({
    taskRepository,
    txManager,
  });

  // 3. Return the container
  return {
    userUseCase,
    taskUseCase,
    // ...
  };
};
```

### Injection via Hono Middleware

```typescript
// Inject the container per HTTP request
app.use("*", async (c, next) => {
  const container = createContainer();
  c.set("container", container);
  await next();
});

// Use in handlers
app.openapi(route, async (c) => {
  const container = c.get("container");
  const result = await container.userUseCase.getUserById({ userId });
  // ...
});
```

---

## Error Handling

### AppError

```typescript
class AppError extends BaseError {
  constructor(params: {
    message: string;
    code: ErrorCode;
    cause?: unknown;
    context?: Record<string, unknown>;
  }) { ... }
}

// Error codes
type ErrorCode =
  | "NOT_FOUND"
  | "NOT_UNIQUE"
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "INTERNAL_SERVER_ERROR";
```

### wrap Utility

Converts a Promise into a Result type.

```typescript
const result = await wrap(
  tx.select().from(usersTable).where(eq(usersTable.id, id)).limit(1),
  (err) => new AppError({
    message: "Failed to get user",
    code: "INTERNAL_SERVER_ERROR",
    cause: err,
  }),
);
```

### HTTP Error Handling

A global error handler converts AppError to HTTP responses.

```typescript
// Mapping from error codes to HTTP status codes
const statusMap: Record<ErrorCode, number> = {
  NOT_FOUND: 404,
  NOT_UNIQUE: 409,
  VALIDATION_ERROR: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  INTERNAL_SERVER_ERROR: 500,
};

// Response format
{
  "error": {
    "code": "NOT_FOUND",
    "message": "User not found",
    "requestId": "req_abc123"
  }
}
```

---

## External Service Integration

### AI Service (Gemini)

```typescript
// infra/ai/feedbackGenerator.ts
export const FeedbackGenerator = {
  generate: async (params: GenerateParams): Promise<Result<FeedbackOutput, AppError>> => {
    // 1. Build the prompt
    const prompt = buildPrompt(params);

    // 2. Call Gemini API
    const response = await geminiClient.generateContent(prompt);

    // 3. Parse and validate the response
    const parsed = geminiFeedbackOutputSchema.safeParse(response);
    if (!parsed.success) {
      return Err(new AppError({ ... }));
    }

    // 4. Convert to domain objects
    const items = FeedbackItem.fromGeminiOutput(parsed.data);
    return Ok({ items, ... });
  },
};
```

### Pub/Sub Messaging

Google Cloud Pub/Sub is used for asynchronous processing.

```typescript
// Publish a task
await pubsubClient.publishFeedbackTask({
  sessionId,
  feedbackId,
});

// Subscribe in a worker
await pubsubClient.subscribe(async (message) => {
  const task = feedbackTaskSchema.parse(message.data);
  await feedbackGenerator.generate(task);
  message.ack();
});
```

---

## Testing Strategy

### Testing by Layer

| Layer | Target | Approach |
|-------|--------|----------|
| Domain | Business logic | Pure unit tests |
| UseCase | Orchestration | Using mock repositories |
| Repository | Data access | Using a test DB |
| HTTP | API endpoints | Integration tests |

### Mocking Dependencies

The factory pattern allows dependencies to be swapped during testing.

```typescript
const mockUserRepository = {
  from: () => ({
    getById: async () => Ok(mockUser),
    update: async (user) => Ok(user),
  }),
};

const useCase = UserUseCase.from({
  userRepository: mockUserRepository,
  txManager: mockTxManager,
});
```

---

## Summary

Key characteristics of this architecture:

1. **Clear layer separation**: Responsibilities of Domain/UseCase/Infrastructure are well-defined
2. **Type safety**: Full type inference through Zod schemas and TypeScript
3. **Error handling**: Explicit error flow via the Result type
4. **Testability**: Dependencies can be swapped via the factory pattern
5. **Transaction management**: Atomicity of multiple operations is guaranteed
6. **Immutable updates**: Predictable state management
7. **Aggregate pattern**: Clearly defined consistency boundaries
