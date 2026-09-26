# Elevora — Trial Class Booking Platform

Elevora is a timezone-aware trial class booking platform built as a full-stack assessment project for CodeYoung.

The application allows parents to select their timezone, choose a preferred date and available trial slot, enter parent and student details, and receive a confirmed trial booking with a meeting link.

## Features

- Clean and responsive booking interface
- Parent timezone selection
- Timezone-aware trial slot availability
- 60-minute trial classes
- Mentor availability management
- Mentor daily booking limits
- Booking conflict prevention
- Student name and age collection
- Student age validation from 6 to 17
- Automatic mentor assignment
- MongoDB persistence
- Booking confirmation with meeting link
- Mentor directory with profiles
- IANA timezone and DST support
- Backend request validation using Zod
- REST API architecture

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS

### Backend

- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- Zod
- Luxon

## Architecture

The project follows a simple layered architecture.

    React Frontend
          |
          v
      REST API
          |
          v
     Controllers
          |
          v
       Services
          |
          v
    Mongoose Models
          |
          v
      MongoDB Atlas

## Frontend

The React application handles:

- Booking flow
- Timezone selection
- Date selection
- Availability display
- Parent and student details
- Booking confirmation
- Mentor directory

## Backend

The Express API handles:

- Availability calculation
- Timezone conversion
- Mentor matching
- Booking validation
- Booking conflict detection
- Daily mentor capacity
- MongoDB persistence

## Timezone Handling

All booking times are stored in UTC in MongoDB.

The application uses the parent's selected IANA timezone to convert local date/time into UTC.

Luxon is used for timezone conversion and DST-aware calculations.

Example:

    Parent local time
          |
          v
    IANA timezone
          |
          v
          UTC
          |
          v
       MongoDB

When availability is calculated, the system converts the requested parent time into each mentor's timezone and checks whether the mentor is within the working window.

## Mentor Availability

The current demo contains 10 mentors distributed across:

- Asia/Kolkata
- Europe/London
- America/New_York

Mentors have:

- Name
- Email
- Timezone
- Active/inactive status
- Maximum daily bookings

A mentor is considered available when:

1. The mentor is active.
2. The selected time falls within the mentor's working hours.
3. The booking does not cross the mentor's local calendar day.
4. The mentor has not reached the daily booking limit.
5. The mentor has no overlapping confirmed booking.

## API Endpoints

### Health Check

    GET /api/health

### Get Availability

    GET /api/availability?date=YYYY-MM-DD&timezone=IANA_TIMEZONE

Example:

    /api/availability?date=2026-09-27&timezone=Asia%2FKolkata

### Create Booking

    POST /api/bookings

Request body:

    {
      "parentName": "Test Parent",
      "parentEmail": "parent@example.com",
      "parentTimezone": "Asia/Kolkata",
      "studentName": "Test Student",
      "studentAge": 12,
      "startTimeUTC": "2026-09-27T04:30:00.000Z",
      "endTimeUTC": "2026-09-27T05:30:00.000Z"
    }

## Project Structure

    elevora-trial-booking/
    │
    ├── client/
    │   ├── public/
    │   ├── src/
    │   │   ├── App.tsx
    │   │   ├── App.css
    │   │   ├── index.css
    │   │   └── main.tsx
    │   ├── .env.example
    │   ├── package.json
    │   └── vite.config.ts
    │
    ├── server/
    │   ├── src/
    │   │   ├── config/
    │   │   ├── controllers/
    │   │   ├── models/
    │   │   ├── routes/
    │   │   ├── services/
    │   │   ├── utils/
    │   │   └── server.ts
    │   ├── package.json
    │   └── tsconfig.json
    │
    ├── .gitignore
    ├── README.md
    └── TRANSCRIPT.md

## Running Locally

### Prerequisites

Make sure the following are installed:

- Node.js 20+
- npm
- Git
- MongoDB Atlas account or local MongoDB

### 1. Clone the Repository

    git clone https://github.com/Chethumalli/elevora-trial-booking.git
    cd elevora-trial-booking

### 2. Install Frontend Dependencies

    cd client
    npm install

Create `client/.env`:

    VITE_API_URL=http://localhost:5000

### 3. Install Backend Dependencies

    cd ../server
    npm install

Create `server/.env`:

    PORT=5000
    MONGODB_URI=your_mongodb_connection_string

Do not commit `.env` files.

### 4. MongoDB Setup

Create a MongoDB database using MongoDB Atlas or a local MongoDB instance.

Example MongoDB connection string:

    MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/elevora

Replace the username, password, cluster URL, and database name with your own values.

### 5. Seed Mentors

From the `server` directory:

    npx tsx src/utils/seedMentors.ts

This creates the initial demo mentor data.

### 6. Start Backend

From the `server` directory:

    npm run dev

Backend:

    http://localhost:5000

### 7. Start Frontend

Open another terminal:

    cd client
    npm run dev

Frontend:

    http://localhost:5173

## Production Build

### Backend

    cd server
    npm run build

### Frontend

    cd client
    npm run build

Both builds have been tested successfully.

## Validation and Testing

The following functionality was tested during development:

- MongoDB connection
- Mentor seeding
- Availability API
- Multiple mentor timezones
- UTC conversion
- Daylight Saving Time handling
- Mentor daily booking limits
- Booking conflict prevention
- Student age validation
- Student detail persistence
- End-to-end booking flow
- Frontend production build
- Backend TypeScript build

## Design Decisions

### Guest Booking

Authentication was intentionally not added because the assessment focuses on the trial-class booking workflow.

Guest booking reduces friction for a first-time parent.

### Automatic Mentor Assignment

Parents do not need to manually select a mentor.

The backend finds an eligible mentor based on:

- Timezone
- Working hours
- Daily capacity
- Existing bookings
- Active status

### UTC Storage

Booking timestamps are stored in UTC to provide a consistent source of truth while supporting users and mentors in different timezones.

### IANA Timezones

The application uses IANA timezone identifiers instead of manually configured UTC offsets.

Examples:

- Asia/Kolkata
- Europe/London
- America/New_York

This allows accurate timezone and DST handling.

## Current Limitations

- Meeting links are generated as demo links rather than real video-conference links.
- Email notifications are not integrated.
- Authentication and user accounts are not implemented.
- Cancellation and rescheduling UI are not included.
- Concurrent booking protection could be strengthened with transactional or atomic reservation logic.
- Production deployment configuration is not included.
- Automated test coverage can be expanded.

## Future Improvements

- Real Google Meet integration
- Real Zoom integration
- Email confirmations
- Parent accounts
- Rescheduling and cancellation
- Calendar integration
- Admin dashboard
- Mentor dashboard
- Stronger concurrency control
- Production deployment
- Automated unit tests
- Integration tests
- End-to-end tests
- Booking analytics
- Notification system
- Payment integration for paid classes

## Security Considerations

The application uses backend validation to prevent invalid booking requests.

Zod is used to validate incoming request data.

Possible production improvements include:

- Authentication
- Authorization
- Rate limiting
- Secure HTTP headers
- Input sanitization
- Stronger booking transaction handling
- Production secret management
- Database access restrictions
- API monitoring and logging

## Booking Flow

    Select Timezone
          |
          v
    Select Date
          |
          v
    View Available Slots
          |
          v
    Select Trial Slot
          |
          v
    Enter Parent Details
          |
          v
    Enter Student Details
          |
          v
    Validate Information
          |
          v
    Find Available Mentor
          |
          v
    Create Booking
          |
          v
    Store Booking in MongoDB
          |
          v
    Show Confirmation
          |
          v
    Generate Meeting Link

## Timezone Conversion Example

Suppose a parent selects:

    Date: September 27, 2026
    Time: 10:00 AM
    Timezone: Asia/Kolkata

The application converts the selected local time into UTC before storing it.

    Parent Time
    10:00 AM
    Asia/Kolkata
          |
          v
    UTC Conversion
          |
          v
    04:30 AM UTC
          |
          v
    MongoDB

When checking mentor availability, the backend converts the UTC booking time into the mentor's local timezone.

This allows mentors in different countries to be matched correctly.

## Daylight Saving Time

The application uses IANA timezone identifiers such as:

- Asia/Kolkata
- Europe/London
- America/New_York

Luxon handles timezone offsets and DST transitions automatically.

This avoids relying on fixed UTC offsets such as:

    UTC+5:30
    UTC+1
    UTC-4

because timezone offsets can change depending on the date.

## Booking Conflict Prevention

Before creating a booking, the backend checks whether the selected mentor already has an overlapping confirmed booking.

    Existing Booking
          |
          v
    Check Time Overlap
          |
          +---- Overlap ----> Reject Booking
          |
          +---- No Overlap --> Continue

This prevents two confirmed bookings from being assigned to the same mentor during the same time period.

## Mentor Daily Capacity

Each mentor has a maximum number of bookings allowed per local calendar day.

The backend calculates the mentor's local date from the UTC booking timestamp.

    UTC Booking Time
          |
          v
    Mentor Timezone
          |
          v
    Mentor Local Date
          |
          v
    Count Daily Bookings
          |
          v
    Compare With Daily Limit

If the mentor has reached the daily limit, that mentor is not considered available.

## Automatic Mentor Assignment

Parents do not need to manually select a mentor.

The backend automatically searches for an eligible mentor.

The matching process considers:

    Active Mentor
          +
    Working Hours
          +
    Timezone
          +
    Daily Capacity
          +
    Existing Bookings
          |
          v
    Eligible Mentor

## API Architecture

The backend follows a layered architecture:

    Routes
      |
      v
    Controllers
      |
      v
    Services
      |
      v
    Models
      |
      v
    MongoDB

### Routes

Responsible for defining API endpoints.

### Controllers

Responsible for receiving HTTP requests and returning responses.

### Services

Responsible for application and business logic such as:

- Availability calculation
- Mentor matching
- Booking validation
- Timezone conversion

### Models

Responsible for MongoDB data structures using Mongoose.

### Utilities

Contains reusable helper functionality such as:

- Mentor seeding
- Timezone utilities
- Validation helpers

## Example Booking Request

    POST /api/bookings
    Content-Type: application/json

    {
      "parentName": "Your Name",
      "parentEmail": "parent@example.com",
      "parentTimezone": "Asia/Kolkata",
      "studentName": "Student Name",
      "studentAge": 12,
      "startTimeUTC": "2026-09-27T04:30:00.000Z",
      "endTimeUTC": "2026-09-27T05:30:00.000Z"
    }

## Example Availability Request

    GET /api/availability?date=2026-09-27&timezone=Asia%2FKolkata

The API calculates available trial slots according to the selected date and timezone.

## Application Workflow

                        ┌─────────────────────┐
                        │   Parent Opens App  │
                        └──────────┬──────────┘
                                   |
                                   v
                        ┌─────────────────────┐
                        │ Select Timezone     │
                        └──────────┬──────────┘
                                   |
                                   v
                        ┌─────────────────────┐
                        │ Select Date         │
                        └──────────┬──────────┘
                                   |
                                   v
                        ┌─────────────────────┐
                        │ Get Availability    │
                        └──────────┬──────────┘
                                   |
                                   v
                        ┌─────────────────────┐
                        │ Select Trial Slot   │
                        └──────────┬──────────┘
                                   |
                                   v
                        ┌─────────────────────┐
                        │ Parent + Student    │
                        │ Details             │
                        └──────────┬──────────┘
                                   |
                                   v
                        ┌─────────────────────┐
                        │ Backend Validation  │
                        └──────────┬──────────┘
                                   |
                                   v
                        ┌─────────────────────┐
                        │ Find Mentor         │
                        └──────────┬──────────┘
                                   |
                                   v
                        ┌─────────────────────┐
                        │ Create Booking      │
                        └──────────┬──────────┘
                                   |
                                   v
                        ┌─────────────────────┐
                        │ MongoDB             │
                        └──────────┬──────────┘
                                   |
                                   v
                        ┌─────────────────────┐
                        │ Booking Confirmation│
                        │ + Meeting Link      │
                        └─────────────────────┘

## Project Branding

### Elevora

Personalized learning. Real progress.

© 2026 Elevora · Assessment project for CodeYoung

## Author

Developed by **Chethan C. Malli**

AI/ML Enthusiast | Full-Stack Developer

GitHub: https://github.com/Chethumalli

## Assessment

This project was developed as a full-stack assessment project for **CodeYoung**.

The project demonstrates:

- Frontend development
- Backend API development
- REST API architecture
- MongoDB integration
- Timezone-aware scheduling
- IANA timezone handling
- DST-aware calculations
- Backend validation
- Booking conflict prevention
- Mentor assignment
- Responsive UI development
- TypeScript
- React
- Node.js
- Express.js

## License

This project was developed for assessment and demonstration purposes.

© 2026 Elevora · Assessment project for CodeYoung

Developed by **Chethan C. Malli**