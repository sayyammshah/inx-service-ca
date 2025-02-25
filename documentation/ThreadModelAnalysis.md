# Comment & Reply Model Analysis

### **Model**

```json
{
  "entity": "s"tring, // Post ID
  "author": "string", // Author ID
  "parentThread": "string | null", // Null for comment, threadId for reply
  "threadId": "string", // New ID generated for each document
  "rootThread": "string", // Own threadId if comment, else root thread of comment
  "depth": 0 | 1 | 2, // 0 for comment, 1 for reply, 2 for nested reply
  "content": "string", // Comment or reply text
  "path": "string", // Materialized Path (all threadIds from root to itself)
  "stats": {
     "likes": "number",
     "dislikes": "number"
  },
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### `rootThread` Explanation

- **Without** `rootThread`

  - **1st Comment: generate hexadecimal** `threadId`
  - **1st Reply:** `parentThread` = `threadId` of 1st comment
  - **2nd Reply:** `parentThread` = `threadId` of 1st reply

- **With** `rootThread`

  - **1st Comment:** `rootThread` = Own `threadId`
  - **1st Reply:** `rootThread` = `threadId` of 1st Comment
  - **Nested Reply:** `rootThread` = `threadId` of 1st Comment

Using rootThread will make document more query efficient

---

### Rules for Creating new Comment or Reply

### **1. If 1st Comment**

- Generate a new hex `threadId` with 16 characters
- `parentThread`: `null`
- `depth`: `0`
- `rootThread` = \`threadId\`

### **2. If 1st Reply on 1st Comment**

- Generate a new hex `threadId` with 16 characters
- `parentThread`: `threadId` of 1st comment
- `depth`: `1`
- `rootThread` = \`rootThread\`

### **3. If Nested Reply on 1st Reply**

- Generate a new `threadId`
- `parentThread`: `threadId` of 1st reply
- `depth`: `2`
- `rootThread` = \`rootThread\`

---

### Flat Document vs. Nested Document Approach

> Flat Document Structure (Each comment/reply is its own document):

#### Pros:

- _Scalability_: Avoids MongoDB’s 16MB document size limit since each comment or reply is stored independently.
- _Flexibility_: Easier to update or remove individual comments without rewriting an entire large document.
- _Indexing & Querying_: You can index fields like entity, parentThread, rootCommentId, and createdAt for efficient querying.

#### Cons/Considerations:

- _Aggregation Overhead_: When fetching a complete thread (a comment with all its replies), you might need to perform aggregation (e.g., using $graphLookup), which can add some overhead.

> Nested Document Structure (Embedding replies inside a parent comment’s document):

### Pros:

- _Atomicity_: Reading a comment with all its replies is a single document fetch.
  Simplicity in some cases: The data is all together, which might seem easier for simple applications.

#### Cons:

- _Size Limitations_: If a post gets a lot of comments and replies, you could hit MongoDB’s document size limit.
- _Update Complexity_: Every time you add or update a reply, you might need to update a large document, leading to potential performance issues.
- _Concurrency Issues_: With many simultaneous updates to the same document (e.g., multiple users replying at once), you can run into write contention.

### **Summary**

- This model supports _2-level nested replies_ efficiently.
- The `rootThread` helps group entire conversations under the same root comment.
- The _Materialized Path_ allows for future scalability beyond 2-level nesting.
- _Optimized for querying_ using `entityId`, `rootThread`, and `parentThread`.
- _Scalable & performant_ for large-scale applications.
