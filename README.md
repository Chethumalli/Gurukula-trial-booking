# Gurukula — Trial Class Booking Platform

Gurukula is a timezone-aware trial class booking platform built as a full-stack assessment project for CodeYoung.

The application allows parents to select their timezone, choose a preferred date and available trial slot, enter parent and student details, receive a confirmed trial booking, and enter a simulated demo classroom experience through the generated demo class link.

---

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
- Booking confirmation with demo class link
- Demo classroom experience after successful booking
- Demo class opens in a new browser tab
- Demo classroom displays booking and student information
- Leave Demo button to return to the Gurukula home page
- Mentor directory with profiles
- Mentor category filtering
- IANA timezone and DST support
- Backend request validation using Zod
- REST API architecture
- Local booking data persistence for the demo classroom
- Responsive UI for booking and demo classroom screens
- Gurukula branding and footer
- View Portfolio button in the footer

---

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Vercel

### Backend

- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- Zod
- Luxon
- Render

### Database

- MongoDB Atlas

---

## Live Deployment

The application is deployed and publicly accessible.

### Frontend

Vercel:

https://gurukula-trial-booking.vercel.app

### Backend API

Render:

https://elevora-api.onrender.com

### Database

MongoDB Atlas is used for persistent mentor and booking data.

### Deployed Architecture

```text
User
  |
  v
Vercel
React + Vite Frontend
  |
  v
Render
Node.js + Express REST API
  |
  v
MongoDB Atlas
```

The deployed frontend communicates with the deployed backend using the `VITE_API_URL` environment variable.

Production configuration:

```env
VITE_API_URL=https://elevora-api.onrender.com
```

---

## Architecture

The project follows a simple layered architecture.

```text
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
```

This separation keeps the frontend, API handling, business logic, and database models independent and easier to maintain.

---

## Frontend

The React application handles:

- Booking flow
- Timezone selection
- Date selection
- Availability display
- Parent details
- Student details
- Booking confirmation
- Demo classroom
- Mentor directory
- Mentor category filtering
- Demo class navigation
- Returning to the booking home page
- Footer navigation
- Portfolio navigation

The frontend is implemented as a single-page React application with conditional rendering for the main booking experience and the demo classroom experience.

---

## Demo Class Experience

After a successful booking, the confirmation screen provides a **Try Demo Class** option.

When the user opens the demo class:

1. Booking information is saved locally for the demo experience.
2. The demo class opens in a new browser tab.
3. The demo classroom displays the student's booking information.
4. The user can enter the simulated demo classroom.
5. The user can leave the demo at any time.
6. Clicking **Leave Demo** returns the user to the Gurukula home page.

The demo classroom is intentionally simulated because the assessment allows a dummy class or meeting link.

### Demo Class Flow

```text
Booking Confirmed
       |
       v
Try Demo Class
       |
       v
New Browser Tab
       |
       v
Demo Classroom
       |
       v
Start Demo Class
       |
       v
Leave Demo
       |
       v
Gurukula Home Page
```

The demo booking information is stored in browser local storage so that it remains available when the classroom is opened in a new tab or refreshed.

---

## Footer and Portfolio

The Gurukula footer contains the product branding and assessment information.

It includes:

- Gurukula branding
- Personalized learning tagline
- Assessment project information
- Developer information
- View Portfolio button

The **View Portfolio** button provides a direct way for visitors and evaluators to access the developer's portfolio.

Portfolio:

https://chethumalli-portfolio.vercel.app/

---

## Backend

The Express API handles:

- Availability calculation
- Timezone conversion
- Mentor matching
- Booking validation
- Booking conflict detection
- Daily mentor capacity
- MongoDB persistence
- Demo meeting link generation

---

## Timezone Handling

All booking times are stored in UTC in MongoDB.

The application uses the parent's selected IANA timezone to convert local date and time into UTC.

Luxon is used for timezone conversion and DST-aware calculations.

```text
Parent Local Time
       |
       v
IANA Timezone
       |
       v
UTC Conversion
       |
       v
MongoDB
```

When availability is calculated, the system converts the requested parent time into each mentor's timezone and checks whether the mentor is within the configured working window.

---

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
- Working hours
- Working days
- Daily booking capacity

A mentor is considered available when:

1. The mentor is active.
2. The selected time falls within the mentor's working hours.
3. The booking does not cross the mentor's local calendar day.
4. The mentor has not reached the daily booking limit.
5. The mentor has no overlapping confirmed booking.

---

## API Endpoints

### Health Check

```http
GET /api/health
```

### Get Availability

```http
GET /api/availability?date=YYYY-MM-DD&timezone=IANA_TIMEZONE
```

Example:

```text
/api/availability?date=2026-09-27&timezone=Asia%2FKolkata
```

The availability endpoint calculates available 60-minute trial slots according to the selected parent date and timezone.

### Create Booking

```http
POST /api/bookings
```

Request body:

```json
{
  "parentName": "Test Parent",
  "parentEmail": "parent@example.com",
  "parentTimezone": "Asia/Kolkata",
  "studentName": "Test Student",
  "studentAge": 12,
  "startTimeUTC": "2026-09-27T04:30:00.000Z",
  "endTimeUTC": "2026-09-27T05:30:00.000Z"
}
```

---

## Project Structure

```text
gurukula-trial-booking/
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
├── run.bat
├── .gitignore
├── README.md
└── TRANSCRIPT.md
```

---

# Running Locally

## Prerequisites

Make sure the following are installed:

- Node.js 20+
- npm
- Git
- MongoDB Atlas account or local MongoDB

---

## 1. Clone the Repository

```bash
git clone https://github.com/Chethumalli/gurukula-trial-booking.git
cd gurukula-trial-booking
```

---

## 2. Install Frontend Dependencies

```bash
cd client
npm install
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000
```

---

## 3. Install Backend Dependencies

Open a new terminal and navigate to the backend:

```bash
cd server
npm install
```

Create `server/.env`:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

Do not commit `.env` files to GitHub.

---

## 4. MongoDB Setup

Create a MongoDB database using MongoDB Atlas or a local MongoDB instance.

Example connection string:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gurukula
```

Replace the username, password, cluster URL, and database name with your own values.

---

## 5. Seed Mentors

From the `server` directory:

```bash
npx tsx src/utils/seedMentors.ts
```

This creates the initial demo mentor data.

---

## 6. Run the Project Using `run.bat`

For Windows development, the project includes a `run.bat` file that starts both the backend and frontend development servers.

From the project root:

```powershell
.\run.bat
```

The script automatically:

1. Checks whether Node.js is available.
2. Starts the backend development server.
3. Starts the frontend development server.
4. Opens the frontend in the browser.

Default local URLs:

```text
Frontend: http://localhost:5173
Backend:  http://localhost:5000
```

This is the recommended way to start the complete application locally on Windows.

### Manual Startup

The services can also be started separately.

#### Start Backend

```bash
cd server
npm run dev
```

Backend:

```text
http://localhost:5000
```

#### Start Frontend

Open another terminal:

```bash
cd client
npm run dev
```

Frontend:

```text
http://localhost:5173
```

Keep both terminal windows running while developing.

---

## Production Deployment

The application is deployed using Vercel, Render, and MongoDB Atlas.

### Frontend Deployment

The React frontend is deployed on Vercel.

```text
https://gurukula-trial-booking.vercel.app
```

### Backend Deployment

The Node.js and Express backend is deployed on Render.

```text
https://elevora-api.onrender.com
```

### Database Deployment

MongoDB Atlas is used as the cloud database.

### Production Environment Variable

The Vercel frontend uses:

```env
VITE_API_URL=https://elevora-api.onrender.com
```

This allows the deployed frontend to communicate with the deployed backend.

### Production Architecture

```text
Vercel
React + Vite
     |
     v
Render
Node.js + Express
     |
     v
MongoDB Atlas
```

---

## Production Build

### Backend

```bash
cd server
npm run build
```

### Frontend

```bash
cd client
npm run build
```

Both frontend and backend production builds were tested successfully before deployment.

The frontend was then deployed to Vercel and the backend was deployed to Render.

---

## Validation and Testing

The following functionality was tested during development and deployment:

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
- Booking confirmation
- Demo class opening
- Demo class opening in a new browser tab
- Demo classroom data persistence using local storage
- Leave Demo navigation back to the home page
- Footer View Portfolio button
- Frontend production build
- Backend TypeScript build
- Vercel frontend deployment
- Render backend deployment
- Deployed frontend-to-backend API communication

---

# Design Decisions

## Guest Booking

Authentication was intentionally not added because the assessment focuses on the trial-class booking workflow.

Guest booking reduces friction for a first-time parent.

---

## Automatic Mentor Assignment

Parents do not need to manually select a mentor.

The backend finds an eligible mentor based on:

- Timezone
- Working hours
- Working days
- Daily capacity
- Existing bookings
- Active status

---

## UTC Storage

Booking timestamps are stored in UTC to provide a consistent source of truth while supporting users and mentors in different timezones.

---

## IANA Timezones

The application uses IANA timezone identifiers instead of manually configured UTC offsets.

Examples:

- `Asia/Kolkata`
- `Europe/London`
- `America/New_York`

This allows accurate timezone and DST handling.

---

## Demo Classroom

A real video conferencing service was not required for the assessment.

Instead, the application provides a simulated demo classroom experience after booking.

This allows the complete customer journey to be demonstrated:

```text
Booking
   |
   v
Confirmation
   |
   v
Demo Class
   |
   v
Leave Demo
   |
   v
Home Page
```

---

## New-Tab Demo Experience

The demo classroom opens in a new browser tab to simulate the experience of joining an online class while keeping the original booking page available.

---

## Footer Portfolio Access

A **View Portfolio** button was added to the footer so evaluators and visitors can easily access the developer's portfolio without interrupting the main booking experience.

Portfolio:

https://chethumalli-portfolio.vercel.app/

---

# Booking Flow

```text
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
Try Demo Class
       |
       v
Open Demo Classroom
       |
       v
Leave Demo
       |
       v
Return to Home Page
```

---

# Timezone Conversion Example

Suppose a parent selects:

```text
Date: September 27, 2026
Time: 10:00 AM
Timezone: Asia/Kolkata
```

The application converts the selected local time into UTC before storing it.

```text
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
```

When checking mentor availability, the backend converts the UTC booking time into the mentor's local timezone.

This allows mentors in different countries to be matched correctly.

---

# Daylight Saving Time

The application uses IANA timezone identifiers such as:

- `Asia/Kolkata`
- `Europe/London`
- `America/New_York`

Luxon handles timezone offsets and DST transitions automatically.

This avoids relying on fixed UTC offsets such as:

```text
UTC+5:30
UTC+1
UTC-4
```

because timezone offsets can change depending on the date.

---

# Booking Conflict Prevention

Before creating a booking, the backend checks whether the selected mentor already has an overlapping confirmed booking.

```text
Existing Booking
       |
       v
Check Time Overlap
       |
       +---- Overlap ----> Reject Booking
       |
       +---- No Overlap --> Continue
```

This prevents two confirmed bookings from being assigned to the same mentor during the same time period.

---

# Mentor Daily Capacity

Each mentor has a maximum number of bookings allowed per local calendar day.

The backend calculates the mentor's local date from the UTC booking timestamp.

```text
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
```

If the mentor has reached the daily limit, that mentor is not considered available.

---

# Automatic Mentor Assignment

Parents do not need to manually select a mentor.

The backend automatically searches for an eligible mentor.

The matching process considers:

```text
Active Mentor
     +
Working Hours
     +
Working Days
     +
Timezone
     +
Daily Capacity
     +
Existing Bookings
     |
     v
Eligible Mentor
```

---

# API Architecture

The backend follows a layered architecture:

```text
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
```

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
- Booking creation

### Models

Responsible for MongoDB data structures using Mongoose.

### Utilities

Contains reusable helper functionality such as:

- Mentor seeding
- Timezone utilities
- Validation helpers

---

# Example Booking Request

```http
POST /api/bookings
Content-Type: application/json
```

```json
{
  "parentName": "Your Name",
  "parentEmail": "parent@example.com",
  "parentTimezone": "Asia/Kolkata",
  "studentName": "Student Name",
  "studentAge": 12,
  "startTimeUTC": "2026-09-27T04:30:00.000Z",
  "endTimeUTC": "2026-09-27T05:30:00.000Z"
}
```

---

# Example Availability Request

```http
GET /api/availability?date=2026-09-27&timezone=Asia%2FKolkata
```

The API calculates available trial slots according to the selected date and timezone.

---

# Application Workflow

```text
┌─────────────────────────┐
│     Parent Opens App    │
└────────────┬────────────┘
             |
             v
┌─────────────────────────┐
│     Select Timezone     │
└────────────┬────────────┘
             |
             v
┌─────────────────────────┐
│       Select Date       │
└────────────┬────────────┘
             |
             v
┌─────────────────────────┐
│    Get Availability     │
└────────────┬────────────┘
             |
             v
┌─────────────────────────┐
│    Select Trial Slot    │
└────────────┬────────────┘
             |
             v
┌─────────────────────────┐
│   Parent + Student      │
│        Details          │
└────────────┬────────────┘
             |
             v
┌─────────────────────────┐
│   Backend Validation    │
└────────────┬────────────┘
             |
             v
┌─────────────────────────┐
│      Find Mentor        │
└────────────┬────────────┘
             |
             v
┌─────────────────────────┐
│     Create Booking      │
└────────────┬────────────┘
             |
             v
┌─────────────────────────┐
│      MongoDB Atlas      │
└────────────┬────────────┘
             |
             v
┌─────────────────────────┐
│ Booking Confirmation    │
│   + Demo Class Link     │
└────────────┬────────────┘
             |
             v
┌─────────────────────────┐
│     Try Demo Class      │
└────────────┬────────────┘
             |
             v
┌─────────────────────────┐
│    Demo Classroom       │
└────────────┬────────────┘
             |
             v
┌─────────────────────────┐
│       Leave Demo        │
└────────────┬────────────┘
             |
             v
┌─────────────────────────┐
│    Gurukula Home Page   │
└─────────────────────────┘
```

---

# Demo Classroom Workflow

The demo classroom is available through the booking confirmation after a successful trial booking.

The flow is:

```text
Booking Confirmation
       |
       v
Try Demo Class
       |
       v
Open Demo
       |
       v
Demo Classroom
       |
       v
Start Demo Class
       |
       v
Leave Demo
       |
       v
Return to /
```

The demo classroom is implemented inside the frontend application and uses the booking information stored in browser local storage.

---

# Demo Classroom Information

The demo classroom can display information related to the confirmed booking, including:

- Student name
- Student age
- Parent information
- Mentor information
- Selected date
- Selected time
- Parent timezone
- Trial class duration
- Demo classroom status

The classroom is intended to simulate the user experience of joining an online trial class without requiring an external video conferencing provider.

---

# Customer Experience

The application is designed around a simple parent-first booking experience.

The intended customer journey is:

1. Parent opens Gurukula.
2. Parent selects their timezone.
3. Parent chooses a suitable date.
4. Parent views available trial slots.
5. Parent selects a slot.
6. Parent enters their details.
7. Parent enters the student's details.
8. The system automatically finds a suitable mentor.
9. The booking is created.
10. The parent receives a booking confirmation.
11. The parent can try the demo class.
12. The demo class opens in a separate browser tab.
13. The parent can leave the demo and return to the Gurukula home page.
14. The parent can use the View Portfolio button in the footer to visit the developer portfolio.

---

# Current Limitations

- The demo classroom is simulated rather than a real video-conferencing environment.
- Meeting links are generated as demo links rather than real video-conference links.
- Email notifications are not integrated.
- Authentication and user accounts are not implemented.
- Cancellation and rescheduling UI are not included.
- Concurrent booking protection could be strengthened with transactional or atomic reservation logic.
- Automated test coverage can be expanded.

---

# Future Improvements

- Real Google Meet integration
- Real Zoom integration
- Email confirmations
- Parent accounts
- Rescheduling and cancellation
- Calendar integration
- Admin dashboard
- Mentor dashboard
- Stronger concurrency control
- Automated unit tests
- Integration tests
- End-to-end tests
- Booking analytics
- Notification system
- Payment integration for paid classes
- Real-time classroom functionality
- Real-time mentor/student video communication

---

# Security Considerations

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

---

# Project Branding

## Gurukula

**Personalized learning. Real progress.**

© 2026 Gurukula · Assessment project for CodeYoung

Developed by **Chethan C. Malli**

The footer also includes a **View Portfolio** button.

---

# Author

Developed by **Chethan C. Malli**

AI/ML Enthusiast | Full-Stack Developer

GitHub:

https://github.com/Chethumalli

Portfolio:

https://chethumalli-portfolio.vercel.app/

---

# Assessment

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
- Demo classroom experience
- New-tab demo class navigation
- Leave Demo navigation
- Responsive UI development
- Footer portfolio navigation
- TypeScript
- React
- Node.js
- Express.js
- Vercel deployment
- Render deployment
- MongoDB Atlas integration

---

# License

This project was developed for assessment and demonstration purposes.

© 2026 Gurukula · Assessment project for CodeYoung

Developed by **Chethan C. Malli**
