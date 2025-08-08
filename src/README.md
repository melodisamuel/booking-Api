# Booking API

A simple Booking API for property rentals (like Airbnb).

---

## Features

- List properties with pagination and date filtering  
- View property availability  
- Create, update, and cancel bookings with date validations  
- Centralized error handling  
- Integration tests for core endpoints  

---

## Setup Instructions

1. **Clone the repo**  
   ```bash
   git clone <repo_url>
   cd booking-api


Install dependencies 
npm install

Configure environment variables 
DB_USERNAME=Local DB
DB_PASSWORD=Db_Api
DB_NAME=booking_api
DB_HOST=127.0.0.1
PORT=3000

Setup the database
npx sequelize db:create
npx sequelize db:migrate

Start the server
npm start