# Stage 1: Install dependencies
FROM python:3.9 AS builder
WORKDIR /usr/src/app
COPY requirements.txt ./
RUN pip install --no-cache-dir --user -r requirements.txt

# Stage 2: Create the final image
FROM python:3.9-slim
WORKDIR /usr/src/app

# Copy dependencies installed in the previous stage
COPY --from=builder /root/.local /root/.local

# Copy your application code
COPY . .

# Set the PATH so Python/user base packages are found
ENV PATH=/root/.local/bin:$PATH

# Run the service (change the script name per service)
CMD ["python", "app.py"]
# For notification-service, use:
# CMD ["python", "notification_service.py"]
