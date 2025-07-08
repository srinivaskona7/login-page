# Login Page - Microservices Application

This project contains a complete, deployable microservices application with a React frontend and Python backend services.

## Method 1: Run Locally with Docker Compose

1.  **Prerequisite:** Install Docker and Docker Compose.
2.  Create the `.env` file in the root directory and paste the content provided.
3.  Navigate to the root `login-page/` directory.
4.  Run the command:
    ```bash
    docker-compose up --build
    ```
5.  Open your browser and go to `http://localhost:3000`.

## Method 2: Deploy to Kubernetes

1.  **Build and Push Docker Images:**
    * Log in to Docker Hub: `docker login`
    * For each service (`frontend`, `user-service`, `course-service`, `notification-service`), navigate to its directory and run the build/push commands.

    ```bash
    # Example for user-service
    cd user-service
    docker build -t sriniv7654/busybox2:login-page-user-service .
    docker push sriniv7654/busybox2:login-page-user-service
    cd ..
    ```
    * Repeat for all services, replacing the tag accordingly (`:login-page-frontend`, etc.).

2.  **Apply Kubernetes Manifests:**
    * Ensure `kubectl` is configured to your cluster.
    * Apply the YAML files from the `kubernetes/` directory **in order**.

    ```bash
    kubectl apply -f kubernetes/0-secrets.yaml
    kubectl apply -f kubernetes/1-configmap.yaml
    kubectl apply -f kubernetes/2-mongodb-deployment.yaml
    kubectl apply -f kubernetes/3-user-service-deployment.yaml
    kubectl apply -f kubernetes/4-course-service-deployment.yaml
    kubectl apply -f kubernetes/5-notification-service-deployment.yaml
    kubectl apply -f kubernetes/6-frontend-deployment.yaml
    ```

3.  **Access the Application:**
    * Find the external IP address for the frontend service.
    ```bash
    kubectl get service frontend-service
    ```
    * It may take a minute for the `EXTERNAL-IP` to be assigned. Once it is, open your browser and navigate to that IP address.