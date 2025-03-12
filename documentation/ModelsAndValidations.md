# Database Models Design & Validation Rules

**Description**

This Contains all the database nodels and validations rules applies on this. Also represents how this models are related to each other with which foreign keys.

## Users

### Model

```typescript
{
  userId: string,
  name: string,
  email: string,
  password: string,
  dob: Date,
  gender: Gender,
  profilePicture: string,
  createdAt: Date,
  updatedAt: Date
}
```

### Validation Rules

| Field          | Type     | Required | Min Length | Max Length | Format/Regex                | Description                                                |
| -------------- | -------- | -------- | ---------- | ---------- | --------------------------- | ---------------------------------------------------------- |
| userId         | _string_ | Yes      | 16         | 16         | `/^[0-9a-fA-F]{16}$/`       | Hex ID that uniquely identifies the user.                  |
| name           | _string_ | Yes      | 2          | 50         | -                           | User’s full name (firstName + lastName).                   |
| email          | _string_ | Yes      | 5          | 25         | `/^\S+@\S+\.\S+$/`          | Valid email address.                                       |
| password       | _string_ | Yes      | 8          | 16         | `/[A-Za-z\d@$!%*?&]{8,16}/` | Secure password (letters, numbers, or special characters). |
| dob            | _Date_   | No       | -          | -          | Unix epoch                  | Date of birth.                                             |
| gender         | _enum_   | No       | -          | -          | `male`, `female`, `other`   | Gender.                                                    |
| profilePicture | _string_ | No       | -          | -          | Base64                      | Profile picture (base64 encoded).                          |
| createdAt      | _number_ | Yes      | -          | -          | Unix epoch                  | Timestamp when the user document was created.              |
| updatedAt      | _number_ | Yes      | -          | -          | Unix epoch                  | Timestamp when the user document was last updated.         |

## Insights

### Model

```typescript
{
  entity: string,
  authorId: string,
  title: string,
  content: string,
  tags: string[],
  stats: {
    likes: number,
    dislikes: number,
    views: number,
    comments: number
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Validation Rules

| Field     | Type       | Required | Min Length | Max Length | Format/Regex          | Description                                                    |
| --------- | ---------- | -------- | ---------- | ---------- | --------------------- | -------------------------------------------------------------- |
| insightId | _string_   | Yes      | 16         | 16         | `/^[0-9a-fA-F]{16}$/` | Hex ID that uniquely identifies the post.                      |
| authorId  | _string_   | Yes      | 16         | 16         | `/^[0-9a-fA-F]{16}$/` | Reference to the `userId` from the Users model.                |
| title     | _string_   | Yes      | 5          | 100        | -                     | Post title.                                                    |
| content   | _string_   | Yes      | 5          | 500        | -                     | Post content.                                                  |
| tags      | _string[]_ | No       | -          | 5          | -                     | tags (max 5 tags, 15 chars each).                              |
| stats     | _object_   | Yes      | -          | -          | -                     | Engagement metrics (`likes`, `dislikes`, `views`, `comments`). |
| createdAt | _number_   | Yes      | -          | -          | Unix epoch            | Timestamp when the post was created.                           |
| updatedAt | _number_   | Yes      | -          | -          | Unix epoch            | Timestamp when the post was last updated.                      |

## Threads

### Model

```typescript
{
  insightId: string,
  authorId: string,
  parentThread: string | null,
  threadId: string,
  rootThread: string,
  depth: Depth,
  path: string,
  content: string,
  stats: {
    likes: number,
    dislikes: number
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Validation Rules

| Field        | Type               | Required | Min Length | Max Length | Format/Regex          | Description                                                          |
| ------------ | ------------------ | -------- | ---------- | ---------- | --------------------- | -------------------------------------------------------------------- |
| threadId     | _string_           | Yes      | 16         | 16         | `/^[0-9a-fA-F]{16}$/` | Unique identifier for this thread entry.                             |
| insightId    | _string_           | Yes      | 16         | 16         | `/^[0-9a-fA-F]{16}$/` | Linked post's unique identifier (references Insights `entity`).      |
| authorId     | _string_           | Yes      | 16         | 16         | `/^[0-9a-fA-F]{16}$/` | Comment author's user ID (matches Users `userId`).                   |
| parentThread | _string_ or _null_ | Yes      | 16         | 16         | `/^[0-9a-fA-F]{16}$/` | Direct parent thread's ID (null if top-level comment).               |
| rootThread   | _string_           | Yes      | 16         | 16         | `/^[0-9a-fA-F]{16}$/` | Original top-level thread's ID (never null).                         |
| depth        | _enum_             | Yes      | -          | -          | `0`, `1`, `2`         | Level in comment hierarchy: `0`=top, `1`=reply, `2`=nested reply.    |
| path         | _string_           | Yes      | -          | -          | -                     | Hierarchy path as slash-separated IDs (e.g., "root/parent/current"). |
| content      | _string_           | Yes      | 5          | 500        | -                     | User-written comment/reply text.                                     |
| stats        | _object_           | Yes      | -          | -          | -                     | Count of likes/dislikes.                                             |
| createdAt    | _number_           | Yes      | -          | -          | Unix epoch            | Creation timestamp.                                                  |
| updatedAt    | _number_           | Yes      | -          | -          | Unix epoch            | Last update timestamp.                                               |

---

## Database Relationships

_(Foreign Key Connections)_

### 1. Users ↔ Insights

| Users Field   | Relationship | Insights Field  | Description                      |
| ------------- | ------------ | --------------- | -------------------------------- |
| `userId` (PK) | →            | `authorId` (FK) | Each user can create many posts. |

### 2. Users ↔ Threads

| Users Field   | Relationship | Threads Field   | Description                         |
| ------------- | ------------ | --------------- | ----------------------------------- |
| `userId` (PK) | →            | `authorId` (FK) | Each user can create many comments. |

### 3. Insights ↔ Threads

| Insights Field   | Relationship | Threads Field    | Description                       |
| ---------------- | ------------ | ---------------- | --------------------------------- |
| `insightId` (PK) | →            | `insightId` (FK) | Each post can have many comments. |

### 4. Threads ↔ Threads (Self)

| Parent Thread Field | Relationship | Child Thread Field  | Description                          |
| ------------------- | ------------ | ------------------- | ------------------------------------ |
| `threadId` (PK)     | →            | `parentThread` (FK) | Nested replies under parent comment. |
| `threadId` (PK)     | →            | `rootThread` (FK)   | Root comment for nested replies.     |

---

### Glossary

- **PK**: Primary Key | **FK**: Foreign Key
- **→**: "Connects to" (one-to-many relationship)
