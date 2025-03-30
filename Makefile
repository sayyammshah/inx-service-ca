# Manual docker setup

# ------- Run Existing Containers -------

# Start application
start-inx-app:
	echo "Starting InsightX Service..."
	docker start inx-srvc-database
	docker start inx-srvc-server
	
# Stop application
stop-inx-app:
	docker stop inx-srvc-database
	docker stop inx-srvc-server
	echo "Completed"

# ------- Build from scratch -------
# Create network
create-inx-network:
	echo "Creating inx network..."
	docker network create inx-srvc-network

# Create Storage
create-inx-storage:
	echo "Creating inx storage volume..."
	docker volume create inx-srvc-storage

# Start database container
run-db-srvc:
	echo "Running database container..."
	docker run -d \
	--name inx-srvc-database \
	--network inx-srvc-network \
	-v inx-srvc-storage:/data/db \
	-e MONGO_INITDB_ROOT_USERNAME=admin \
	-e MONGO_INITDB_ROOT_PASSWORD=adminInxPass \
	-p 27017:27017 \
	mongodb/mongodb-community-server:5.0.27-ubi8

# Build docker image of an aplication
build-inx:
	echo "Building inx web server image..."
	docker build -t inx-srvc:1.0 .

# Run image container created in previous step
run-inx-srvc:
	echo "Running inx application..."
	docker run -d \
	--name inx-srvc-server \
	--network inx-srvc-network \
	-p 3001:3001 \
	inx-srvc:1.0

# Default Commands
default:
	echo "Starting InsightX Service..."
	make start-inx-app
