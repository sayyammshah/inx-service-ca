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
6. Setup CD Workflow (with DockerHub and Github Container Registery)
7. Generate dummy data using AI for testing
8. Update stats.comments in `Insights` Collection when new threads is added - (hint. use aggregation query)

# TODOs

1. Modify FetchInsight routes
   - to fetch personalised recommendations based on tags
2. Write Test Cases
3. Accept Form data for user and insights instead of application/json
4. Setup Socket for inisghts and its like dislike updates
5. Setup schema validations - (JOI)
6. For Update queries modify `updatedAt` key
7. Encrypt and Decrypt payloads and resposes

---

References:

- Github CD Actions:
  - [Video](https://youtu.be/RgZyX-e6W9E?si=h3FPkPK7PzNuXcjR)
  - [Reference](https://github.com/readme/guides/sothebys-github-actions) | Later deploy it to azure app services
