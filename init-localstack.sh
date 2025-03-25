#!/bin/bash
echo "Waiting for LocalStack to be ready..."
while ! nc -z localhost 4566; do
  sleep 1
done

echo "Creating S3 bucket..."
aws --endpoint-url=http://localhost:4566 s3 mb s3://test-bucket
echo "Bucket created successfully!" 