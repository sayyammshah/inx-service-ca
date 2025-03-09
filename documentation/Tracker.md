# Completed Items

1. Repository setup
   - ESLint
   - Prettier
   - Github Actions
2. Routes
   - User
     - CreateAccount
     - Login
   - Insight
     - CreateInsight
     - FetchInsights
       - based on authorId
       - FetchAll
3. Authentication Middleware using crypto
4. Hash Password
5. Application Logging
6. Create and get comments
7. FetchBy AuthorId | FetchAll | FetchBy insight -> {
   - Post Details
   - Comments & Replies
   - User Data?
     } -> Operation aggregate()
8. to aggregate comments

# TODOs

1. Modify FetchInsight routes
   - to fetch personalised recommendations based on tags
2. Generate dummy data using AI for testing
3. Write Test Cases
4. Setup CI/CD
5. Accept Form data for user and insights instead of application/json

---

Fetch Scenarios 3. FetchBy Tags (Personal Recommendation) -> {

- Post Details
- Stats
- UIDs
  } -> Operation aggregate()
