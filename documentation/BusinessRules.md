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
