# Stage 1: Install dependencies
FROM python:3.9 AS builder
WORKDIR /usr/src/app
COPY requirements.txt ./
RUN pip install --no-cache-dir --user -r requirements.txt

# Stage 2: Create the final image
FROM python:3.9-slim
WORKDIR /usr/src/app
COPY --from=builder /root/.local /root/.local
COPY . .

# Make sure installed python user packages are on the PATH
ENV PATH=/root/.local/bin:$PATH

# For user-service and course-service
#CMD ["python", "./app.py"]

# For notification-service use:
CMD ["python", "./notification_service.py"]
