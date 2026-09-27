# Gurukula — Trial Class Booking Platform

Gurukula is a timezone-aware full-stack trial class booking platform developed for the CodeYoung Full-Stack Assessment.

The platform allows parents to select their timezone, choose a learning field, select a preferred mentor, find available trial slots, enter parent and student details, confirm a 60-minute trial class, and access an interactive demo classroom.

## Features

- Timezone-aware trial class booking
- Support for India, UK and US timezones
- DST-aware scheduling using IANA timezones
- 60-minute trial classes
- Learning field selection
- Preferred mentor selection
- Mentor directory and filtering
- 10 demo mentors
- Mentor working hours validation
- Maximum 2 bookings per mentor per day
- Booking conflict prevention
- Automatic mentor assignment
- Parent and student details
- Student age validation
- MongoDB booking persistence
- Booking confirmation
- Demo class link
- Demo class opens in a new browser tab
- Interactive demo classroom
- Real camera and microphone access
- Camera on/off
- Microphone on/off
- Speaker control
- Camera and microphone reconnect
- Live session timer
- Mini JavaScript coding challenge
- Post-class rating and feedback
- Responsive UI
- Portfolio link

## Learning Fields

- AI & Coding
- Python
- Web Development
- Robotics

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Browser Media Devices API
- Vercel

### Backend

- Node.js
- Express.js
- TypeScript
- Mongoose
- Zod
- Luxon
- Render

### Database

- MongoDB Atlas

## Architecture

User → Vercel React + TypeScript + Vite → Render Node.js + Express REST API → MongoDB Atlas

## Booking Flow

1. Select timezone
2. Select date and available time
3. Select learning field
4. Select preferred mentor
5. Enter parent and student details
6. Review booking
7. Backend validates the request
8. Mentor availability is checked
9. Booking is created
10. Booking confirmation is displayed
11. User can open the demo class
12. User completes the interactive demo classroom
13. User submits feedback

## Timezone Handling

Supported timezones include:

- India — `Asia/Kolkata`
- London — `Europe/London`
- Eastern USA — `America/New_York`
- Central USA — `America/Chicago`
- Pacific USA — `America/Los_Angeles`

Luxon is used for timezone conversion and DST-aware scheduling.

Parent-selected local time is converted to UTC, validated against the mentor's local timezone and working hours, and stored as UTC in MongoDB.

## Mentor Availability

The backend checks:

- Mentor active status
- Mentor timezone
- Working days
- Working hours
- Existing bookings
- Daily booking limit
- Booking overlaps

Each mentor can have a maximum of 2 confirmed trial classes per local day.

If no mentor is available, the user is asked to select another slot.

## Demo Classroom

After a successful booking, the user can open the demo class in a new browser tab.

The demo classroom includes:

- Student information
- Mentor information
- Selected course
- Session timer
- Camera preview
- Microphone controls
- Camera controls
- Speaker control
- Camera and microphone reconnect
- Mini coding challenge
- Finish class
- Leave Demo
- Feedback

### Camera and Microphone

The classroom uses the browser Media Devices API to request camera and microphone access.

Users can enable or disable their camera and microphone during the demo session.

## Mini Coding Challenge

The demo classroom contains a simple JavaScript coding challenge designed to simulate an interactive learning session.

## Feedback

After the demo class, the user can:

- Give a 1–5 star rating
- Write feedback
- Select the next learning field

Demo feedback is stored using browser `localStorage`.

## API Endpoints

### Health Check

`GET /api/health`

### Get Available Slots

`GET /api/availability?date=YYYY-MM-DD&timezone=IANA_TIMEZONE`

Example:

`GET /api/availability?date=2026-09-27&timezone=Asia%2FKolkata`

### Create Booking

`POST /api/bookings`

Request body:

`parentName`, `parentEmail`, `parentTimezone`, `studentName`, `studentAge`, `startTimeUTC`, `endTimeUTC`

## Project Structure

    gurukula-trial-booking/
    │
    ├── client/
    │   ├── public/
    │   └── src/
    │       ├── App.tsx
    │       ├── App.css
    │       ├── index.css
    │       └── main.tsx
    │
    ├── server/
    │   └── src/
    │       ├── config/
    │       ├── controllers/
    │       ├── models/
    │       ├── routes/
    │       ├── services/
    │       ├── utils/
    │       └── server.ts
    │
    ├── run.bat
    ├── README.md
    ├── TRANSCRIPT.md
    └── .gitignore

## Local Setup

### Clone Repository

    git clone https://github.com/Chethumalli/gurukula-trial-booking.git
    cd gurukula-trial-booking

### Install Frontend Dependencies

    cd client
    npm install

Create `client/.env`:

    VITE_API_URL=http://localhost:5000

### Install Backend Dependencies

    cd server
    npm install

Create `server/.env`:

    PORT=5000
    MONGODB_URI=your_mongodb_connection_string

### Seed Mentors

    npx tsx src/utils/seedMentors.ts

### Start Backend

    npm run dev

Backend:

    http://localhost:5000

### Start Frontend

    cd client
    npm run dev

Frontend:

    http://localhost:5173

## Environment Variables

### Frontend

Local:

    VITE_API_URL=http://localhost:5000

Production:

    VITE_API_URL=https://elevora-api.onrender.com

### Backend

    PORT=5000
    MONGODB_URI=your_mongodb_connection_string

Never commit real environment variables or database credentials.

## Production Deployment

### Frontend

The frontend is deployed on Vercel.

Production API URL:

`https://elevora-api.onrender.com`

### Backend

The backend is deployed on Render.

Required environment variable:

`MONGODB_URI`

### Database

MongoDB Atlas is used for persistent mentor and booking data.

## Validation and Error Handling

The application handles:

- Invalid timezone
- Invalid date and time
- Invalid email
- Missing parent details
- Missing student details
- Invalid student age
- No available mentors
- Mentor capacity reached
- Booking conflicts
- Camera permission errors
- Microphone permission errors
- Device connection errors

Zod is used for backend request validation.

## Key Technical Decisions

- UTC is used for persistent booking timestamps.
- Luxon handles timezone conversion and DST.
- MongoDB Atlas provides persistent storage.
- Mongoose provides database modeling.
- Zod validates API requests.
- REST APIs separate frontend and backend responsibilities.
- React and TypeScript provide the frontend application structure.
- Tailwind CSS is used for responsive UI development.

## Current Limitations

- Demo meeting links are simulated.
- The demo classroom does not provide real mentor-to-student WebRTC communication.
- Feedback is stored locally for the demo.
- Authentication is not implemented.
- Email and SMS notifications are not implemented.
- Calendar integration is not implemented.
- Payment functionality is not implemented.

## AI-Assisted Development

AI tools were used during development for project planning, architecture guidance, coding assistance, debugging, timezone implementation, UI improvements, deployment guidance, and documentation.

All generated solutions were reviewed, integrated, tested, and refined during development.

The complete AI development transcript is available in `TRANSCRIPT.md`.

## Live Deployment

Frontend:

https://gurukula-trial-booking.vercel.app

Backend:

https://elevora-api.onrender.com

GitHub Repository:

https://github.com/Chethumalli/gurukula-trial-booking

Portfolio:

https://chethumalli-portfolio.vercel.app/

## Assessment

Project: Gurukula — Trial Class Booking Platform

Assessment: CodeYoung Full-Stack Assessment

Developer: Chethan C. Malli

Year: 2026

## Author

Chethan C. Malli

GitHub: https://github.com/Chethumalli

Portfolio: https://chethumalli-portfolio.vercel.app/

## License

This project was developed for assessment and demonstration purposes.

© 2026 Chethan C. Malli