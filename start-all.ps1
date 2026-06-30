Write-Host "Starting RideSync Platform..." -ForegroundColor Green

# 1. Start Infrastructure
Write-Host "Starting Docker Compose infrastructure (Cassandra, Redis, Kafka, RabbitMQ)..." -ForegroundColor Cyan
docker-compose up -d

Write-Host "Waiting 15 seconds for infrastructure to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# 2. Microservices
$services = @(
    "api-gateway",
    "auth-service",
    "autoshift-service",
    "booking-service",
    "driver-service",
    "matching-service",
    "notification-service",
    "payment-service",
    "ride-service",
    "tracking-service",
    "user-service",
    "vehicle-service"
)

# 3. Start Backend Microservices
Write-Host "Starting Backend Microservices..." -ForegroundColor Cyan
foreach ($service in $services) {
    Write-Host "Opening terminal for $service..."
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd services\$service; title $service; npm run dev"
}

# 4. Start Frontend
Write-Host "Starting User Web Frontend..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd apps\user-web; title user-web; npm install @reduxjs/toolkit react-redux react-router-dom framer-motion mapbox-gl socket.io-client axios lucide-react clsx tailwind-merge; npm install -D tailwindcss @tailwindcss/vite @types/mapbox-gl; npm run dev"

Write-Host "Startup complete! A new terminal window has been opened for each microservice and the frontend." -ForegroundColor Green
