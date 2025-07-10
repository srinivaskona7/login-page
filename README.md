# Login Page - Microservices Application

This project contains a complete, deployable microservices application with a React frontend and Python backend services.

## Architecture

- **Frontend**: React application with user registration, login, and course display
- **User Service**: Handles user registration, authentication, and OTP verification
- **Course Service**: Manages course data and provides course listings
- **Notification Service**: Sends OTP emails for user verification
- **Database**: MongoDB for data persistence

## Method 1: Run Locally with Docker Compose

1. **Prerequisites**: 
   - Install Docker and Docker Compose
   - Ensure ports 3000, 5001, 5002, 5003, and 27017 are available

2. **Configuration**:
   - The `.env` file is already configured for local development
   - For email functionality, update `SENDER_EMAIL` and `SENDER_PASSWORD` in `.env` with your Gmail credentials
   - If you don't configure email, the app will run in development mode (OTP will be printed to console)

3. **Run the application**:
   ```bash
   # Navigate to the project root directory
   cd login-page/
   
   # Build and start all services
   docker-compose up --build
   
   # Or run in detached mode
   docker-compose up --build -d
   ```

4. **Access the application**:
   - Open your browser and go to `http://localhost:3000`
   - The application will show a login page with featured books

5. **Testing the application**:
   - Register a new user (OTP will be shown in console if email not configured)
   - Login with registered credentials
   - View the welcome page after successful login

6. **Stop the application**:
   ```bash
   docker-compose down
   ```

## Method 2: Deploy to Kubernetes

1. **Build and Push Docker Images**:
   
   First, log in to Docker Hub:
   ```bash
   docker login
   ```
   
   Then build and push images for each service:
   
   ```bash
   # Frontend
   cd frontend
   docker build -t your-dockerhub-username/login-page-frontend .
   docker push your-dockerhub-username/login-page-frontend
   cd ..
   
   # User Service
   cd user-service
   docker build -t your-dockerhub-username/login-page-user-service .
   docker push your-dockerhub-username/login-page-user-service
   cd ..
   
   # Course Service
   cd course-service
   docker build -t your-dockerhub-username/login-page-course-service .
   docker push your-dockerhub-username/login-page-course-service
   cd ..
   
   # Notification Service
   cd notification-service
   docker build -t your-dockerhub-username/login-page-notification-service .
   docker push your-dockerhub-username/login-page-notification-service
   cd ..
   ```

2. **Update Kubernetes manifests**:
   - Update the image names in the deployment files to match your Docker Hub username
   - Update email credentials in `kubernetes/0-secrets.yaml` (base64 encoded)

3. **Apply Kubernetes Manifests**:
   
   Ensure `kubectl` is configured to your cluster, then apply the YAML files in order:
   
   ```bash
   kubectl apply -f kubernetes/0-secrets.yaml
   kubectl apply -f kubernetes/1-configmap.yaml
   kubectl apply -f kubernetes/2-mongodb-deployment.yaml
   kubectl apply -f kubernetes/3-user-service-deployment.yaml
   kubectl apply -f kubernetes/4-course-service-deployment.yaml
   kubectl apply -f kubernetes/5-notification-service-deployment.yaml
   kubectl apply -f kubernetes/6-frontend-deployment.yaml
   ```

4. **Access the Application**:
   
   Find the external IP address for the frontend service:
   ```bash
   kubectl get service frontend-service
   ```
   
   Wait for the `EXTERNAL-IP` to be assigned, then open your browser and navigate to that IP address.

## Development Notes

- **Email Configuration**: The notification service will work in development mode even without proper email credentials
- **Database**: MongoDB is automatically seeded with sample course data
- **CORS**: All services are configured to handle cross-origin requests
- **Error Handling**: Comprehensive error handling and user feedback throughout the application
- **Security**: Passwords are hashed using bcrypt, and OTPs expire after 10 minutes

## Troubleshooting

1. **Port conflicts**: Ensure the required ports are not in use by other applications
2. **Docker issues**: Try `docker-compose down` and `docker-compose up --build` to rebuild
3. **Email not working**: Check the console logs for OTP in development mode
4. **Database connection**: Ensure MongoDB container is running and accessible

## API Endpoints

- **User Service** (Port 5001):
  - `POST /register` - User registration
  - `POST /verify-otp` - OTP verification
  - `POST /login` - User login

- **Course Service** (Port 5002):
  - `GET /courses` - Get course listings

- **Notification Service** (Port 5003):
  - `POST /send-otp` - Send OTP email
  - `GET /health` - Health check