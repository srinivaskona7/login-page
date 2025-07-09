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

# Ensure the PATH includes the installed packages
ENV PATH=/root/.local/bin:$PATH

CMD ["python", "./notification_service.py"] # For notification-service, this would be notification_service.py