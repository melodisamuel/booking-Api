# 📖 Booking API

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
   git clone <https://github.com/melodisamuel/booking-Api.git>
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


Assumptions & Notes
Dates must be within property availability range.

Bookings cannot overlap existing bookings.

start_date must be before end_date.

Pagination defaults to 10 items per page.

Error responses follow consistent JSON structure with meaningful messages.

# Testing Note
Property tests

First, create a property (POST /properties).

Fetch it with GET /properties and GET /properties/:id/availability.

Booking tests

Use the property’s id from the first step.

Test overlapping bookings to verify error handling.

Try dates outside the property’s availability to see validation in action.

Pagination test

Create multiple properties.

Use GET /properties?page=2&limit=5 to check pagination logic.