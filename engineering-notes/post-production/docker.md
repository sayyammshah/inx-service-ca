# Engineering notes: Docker implementation

Reference on Docker Implementation for This Project. It covers 2 approaches.

### Pre-requisites

- NodeJs - ExpressJs - Typescript
- MongoDB NoSql Database
- GitHub Container Registry.

### Approach 1: Manual

Steps I Took to Set Up Containers, Volumes, Networks, and Images to run the application using containers.

**Step 1: Setup Network**

For two containers to communicate with each other, they must be configured to use the same Docker network.

```bash
docker network create inx-srvc-network
```

**Step 2: Setup Storage**

To persist the data across the container's lifecycle.

```bash
docker volume create inx-srvc-storage
```

**Step 3: Run Database Container**

Pull the official MongoDB community server image from Docker Hub, attach a volume to it, map it to the default location (`/data/db`), and configure the container instance to the docker network (`inx-srvc-network`).

```bash
docker run -d \
--name inx-srvc-database \
--network inx-srvc-network \
-v inx-srvc-storage:/data/db \
-e MONGO_INITDB_ROOT_USERNAME=admin \
-e MONGO_INITDB_ROOT_PASSWORD=adminInxPass \
-p 27017:27017 \
mongodb/mongodb-community-server:5.0.27-ubi8
```

**Step 4: Build Image**

Build docker image

```bash
docker build -t inx-srvc:1.0 .
```

**Step 5: Run Web Server Container**

Once your app image is successfully built, start the container and add this to same network (`inx-srvc-network`).

```bash
docker run -d \
--name inx-srvc-server \
--network inx-srvc-network \
-p 3001:3001 \
inx-srvc:1.0
```

### Additional Docker Commands

1. Open mongodb container shell
   - `docker exec -it inx-srvc-database mongosh -u {username} -p {password}`
2. Open Web Server Container's shell
   - `docker exec -it inx-srvc-server sh`
3. Or use [Makefile](/Makefile)

---

### Approach 2: Using Docker Compose

#### Description

Steps I followed to automate all the manual processes.

**Step 1: Setup `compose.yaml` file**

```yaml
services:
  # inx application configuration
  inx-srvc:
    build:
      context: .
      dockerfile: Dockerfile
    image: inx-srvc:${INX_IMAGE_TAG} # INX_IMAGE_TAG is defined in .env file
    container_name: inx-srvc-server
    # This will start database container first and then application
    depends_on:
      inx-srvc-database:
        condition: service_healthy
        restart: true
    #.env file should be present in same directory
    env_file:
      - .env
    ports:
      - 3001:3001

  # database service setup
  inx-srvc-database:
    image: mongodb/mongodb-community-server:5.0.27-ubi8
    container_name: inx-srvc-database
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=adminInxPass
      - MONGO_INITDB_DATABASE=insightxCaLocal
    volumes:
      - inx-srvc-storage:/data/db
    ports:
      - 27017:27017
    healthcheck:
      test: echo 'db.runCommand("ping").ok' | mongosh mongodb://admin:adminInxPass@localhost:27017/admin --quiet
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s

# Create volume
volumes:
  inx-srvc-storage:
    name: inx-srvc-storage
```

**Step 2: Start application**

To run this application, execute below command

```bash
docker compose up -d
```
