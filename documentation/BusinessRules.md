# Business Rules

> +Field Validations [Reference](./ModelsAndValidations.md)

### Insights (Posts)

#### Basic Rules

| Rule Name                    | Description                                                                                           | Status |
| ---------------------------- | ----------------------------------------------------------------------------------------------------- | ------ |
| **Comment Cooldown**         | Users can comment on a post only **1 minute after its creation** to prevent rushed/spammy replies.    | [ ]    |
| **Edit Time Window**         | Users can edit their posts only within **1 hour of creation** to prevent abuse of historical content. | [ ]    |
| **Like/Dislike Exclusive**   | Users can either like or dislike a post, not both.                                                    | [ ]    |
|                              | Changing a vote removes the previous action.                                                          | [ ]    |
|                              | Ensure that an author can only like or dislike their own post **once**.                               | [ ]    |
| **Unique View Count**        | `stats.views` increments only for **unique logged-in users** to prevent bot-driven inflation.         | [ ]    |
| **Vote Cooldown**            | Users can like/dislike a post only **once every 5 seconds**.                                          | [ ]    |
| **Author-Only Deletion**     | Only the post author can delete the post.                                                             | [ ]    |
| **Post Creation Rate Limit** | Users can create only **5 posts per hour**.                                                           | [ ]    |
| **Comment Frequency Limit**  | Users can comment **once every 30 seconds** on the same post.                                         | [ ]    |

#### Advanced Rules

| Rule Name                    | Description                                                                                                | Status |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------- | ------ |
| **Auto-Flagging for Review** | Posts with **3+ user reports** are automatically hidden pending moderator review.                          | [ ]    |
| **Banned Word Filter**       | Scan title, content, and tags for banned words (e.g., hate speech, slurs) using a pre-defined list or API. | [ ]    |

---

### Users

#### Basic Rules

| Rule Name                    | Description                                                  | Status |
| ---------------------------- | ------------------------------------------------------------ | ------ |
| **Minimum Age Requirement**  | Users must be at least **13 years old** to register.         | [ ]    |
| **Profile Update Frequency** | Users can update their profile only **once every 24 hours**. | [ ]    |

#### Advanced Rules

| Rule Name                    | Description                                                        | Status |
| ---------------------------- | ------------------------------------------------------------------ | ------ |
| **Temporary Account Freeze** | Users can freeze their account for up to **6 months**.             | [ ]    |
| **Password Reset Cooldown**  | Users can request a password reset only **once every 10 minutes**. | [ ]    |

# Fetch Insights

### Stage 1 - in this stage just fetch based on users created

### Stage 2 - in this stage add mechanism of recommendation

---

### Threads (Comments & Replies)

#### Raw

_Mandatory Fields_ -> parentId, Depth & rootId

Scenario 1
A. New Thread added (Comment) - Attributes: - parentThread, rootThread = null - depth = 0 - threadID = randomUUID*Comment1 - path = /${threadId} - Payload: - *Mandatory* -> depth = 0 - parentThread, rootThread = null
B. New Thread Added (1st Reply) - Attributes: - parentThread, rootThread = randomUUID_Comment1 - depth = 1 - threadId = randomUUID_Reply1 - path = ${rootThread}/${parentThread}/${threadId} - Payload: - \_Mandatory* -> depth = 1, parentThread = randomUUID_Comment1

---

A. Hierarchy Validations
_Mandatory Payload_ -> depth, parentId, rootThread
conditions: 1. depth = 0 - parentThread, rootThread = null 2. depth > 1 - parentThread, rootThread != null

notes:

- if parentId or rootId !== null in case of depth > 0

---

1. No RootId in Payload
   -> fetch threads based on parentId
   1.1 if Multiple documents?
   -> sort by createdAt, Order by DESC
   -> topMost item will be root thread
   -> set this rootId to new payload
   1.2 if single document?
   -> set rootId to new payload

---

**Rules for Threads**

1. Hierarchy Validation - Done
2. Check for duplicate depths under same rootId, parentId or insightId
3. Maximum Nested reply allowed as of now is just 2

**Rules for Insights**

1. User can Only edit post within 1 hour of its creation
2. user can only add comments on it after 1 min of its creation
