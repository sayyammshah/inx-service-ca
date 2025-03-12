# Completed Items

1. Repository setup
   - ESLint
   - Prettier
   - Github Actions
   - Husky -> lint-staged
2. Routes
   - User
     - CreateAccount
     - AuthenUser
   - Insight
     - CreateInsight
     - FetchInsights - (with threads - aggregate qry)
       - based on authorId
       - FetchAll
     - UpdateInsight
   - Threads
     - CreateThread
3. Authentication Middleware - crypto
4. Hash Passwords
5. Application Logging

# TODOs

1. Modify FetchInsight routes
   - to fetch personalised recommendations based on tags
2. Generate dummy data using AI for testing
3. Write Test Cases
4. Setup CI/CD
5. Accept Form data for user and insights instead of application/json
6. Setup Socket for inisghts and its like dislike updates
7. Setup schema validations - (JOI)
8. Update stats.comments in `Insights` Collection when new threads is added - (hint. use aggregation query)
9. For Update queries modify `updatedAt` key

---
