#docker run --rm --privileged multiarch/qemu-user-static --reset -p yes

export PROJECT_NAME=ebay-gpu-alerts

echo "Building $PROJECT_NAME..."
docker buildx build --platform linux/arm64 --tag $PROJECT_NAME --load .

echo "Updating image..."
docker tag $(docker images --filter=reference=$PROJECT_NAME --format "{{.ID}}") 192.168.1.8:32768/$PROJECT_NAME:latest

echo "Pushing image..."
docker push 192.168.1.8:32768/$PROJECT_NAME:latest
