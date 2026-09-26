# Elevora — Development Transcript

## Project

**Project Name:** Elevora — Trial Class Booking Platform

**Assessment:** CodeYoung Full-Stack Assessment

**Developer:** Chethan C. Malli

**Date:** September 2026

---

# 1. Project Objective

The objective of this project was to build a timezone-aware trial class booking platform.

The application allows a parent to:

1. Select their timezone.
2. Select a preferred date.
3. View available trial class slots.
4. Enter parent details.
5. Enter student details.
6. Confirm a trial class.
7. Receive a booking confirmation and meeting link.

The backend is responsible for calculating mentor availability and creating the booking.

---

# 2. Technology Selection

The project was implemented using:

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS

### Backend

- Node.js
- Express.js
- TypeScript

### Database

- MongoDB Atlas
- Mongoose

### Supporting Libraries

- Luxon for timezone handling
- Zod for request validation

---

# 3. Initial Project Structure

The project was organized into separate frontend and backend applications.

    elevora-trial-booking/
    │
    ├── client/
    │
    ├── server/
    │
    ├── README.md
    └── TRANSCRIPT.md

The separation allows frontend and backend responsibilities to remain independent.

---

# 4. Frontend Development

The frontend was created using Vite with React and TypeScript.

The initial structure included:

    client/
    ├── src/
    │   ├── App.tsx
    │   ├── App.css
    │   ├── index.css
    │   └── main.tsx
    ├── public/
    ├── package.json
    └── vite.config.ts

Tailwind CSS was added for styling.

The booking experience was designed around four major steps:

    Timezone
       ↓
    Date & Time
       ↓
    Your Details
       ↓
    Confirmation

---

# 5. Product Branding

The application was branded as:

## Elevora

Tagline:

> Personalized learning. Real progress.

The branding was chosen to give the application a standalone product identity rather than presenting it as an internal CodeYoung application.

The footer clearly identifies the project as:

    © 2026 Elevora · Assessment project for CodeYoung
    Developed by Chethan C. Malli

---

# 6. Booking Experience

The frontend was designed to minimize unnecessary steps.

The booking flow became:

    Select Timezone
           ↓
    Select Date
           ↓
    Select Available Time
           ↓
    Enter Parent Details
           ↓
    Enter Student Details
           ↓
    Review Booking
           ↓
    Confirm

A mentor is automatically selected by the backend instead of requiring the parent to manually choose one.

---

# 7. Mentor Directory

A mentor directory was added as an additional product-exploration feature.

The directory contains 10 demo mentors distributed across multiple timezones.

Mentor information includes:

- Name
- Role
- Timezone
- Experience
- Education
- Languages
- Specialties
- Student age focus

The mentor directory is separate from the booking selection process.

The booking system automatically determines which mentor can handle a selected slot.

---

# 8. Backend Architecture

The backend follows a layered architecture.

    Routes
      ↓
    Controllers
      ↓
    Services
      ↓
    Models
      ↓
    MongoDB

### Routes

Routes define the available HTTP endpoints.

### Controllers

Controllers handle:

- Request validation
- Request parsing
- HTTP responses
- Error handling

### Services

Services contain business logic.

The main services are:

    availability.service.ts
    booking.service.ts
    timezone.service.ts

### Models

Mongoose models define the database structure.

    Mentor
    Booking

---

# 9. Database Design

Two main MongoDB collections were used.

## Mentors

The mentor document contains:

    name
    email
    timezone
    isActive
    maxDailyBookings

## Bookings

The booking document contains:

    parentName
    parentEmail
    parentTimezone
    studentName
    studentAge
    mentorId
    startTimeUTC
    endTimeUTC
    status
    meetingLink

---

# 10. Timezone Implementation

Timezone handling was one of the most important technical requirements.

Luxon was used because it supports IANA timezone identifiers and daylight-saving transitions.

Example timezones:

    Asia/Kolkata
    Europe/London
    America/New_York

The selected parent time is converted into UTC.

    Parent Local Time
            ↓
    IANA Timezone
            ↓
          Luxon
            ↓
           UTC
            ↓
         MongoDB

When availability is calculated, the UTC slot is converted into every mentor's timezone.

The mentor's local working hours are then checked.

---

# 11. Working Hours

The system uses the following mentor working window:

    09:00 — 20:00

Each trial class lasts:

    60 minutes

A mentor cannot be assigned if the selected booking falls outside their working window.

---

# 12. Daily Booking Capacity

Each mentor has a maximum daily booking limit.

The demo mentor data uses:

    maxDailyBookings = 2

Before creating a booking, the backend counts confirmed bookings for that mentor's local calendar day.

If the maximum has been reached, that mentor is skipped.

---

# 13. Overlapping Booking Prevention

The booking service checks whether the requested interval overlaps an existing confirmed booking.

The overlap condition is effectively:

    Existing start < New end
    AND
    Existing end > New start

If an overlap is found, the mentor is not assigned.

This prevents two bookings from occupying the same mentor at the same time.

---

# 14. Cross-Midnight Protection

A booking should not cross into another mentor's local calendar day.

A validation check was added to ensure:

    mentorStart local date
    ==
    mentorEnd local date

If the dates are different, the mentor is skipped.

This keeps the availability calculation and booking creation logic consistent.

---

# 15. Student Validation

The frontend collects:

    Student Name
    Student Age

The supported age range is:

    6 — 17

The backend validates the age using both Zod and Mongoose.

This prevents invalid values from being accepted by the API or stored in the database.

---

# 16. API Development

The backend exposes the following main endpoints.

## Health

    GET /api/health

## Availability

    GET /api/availability?date=YYYY-MM-DD&timezone=TIMEZONE

## Booking

    POST /api/bookings

The API uses JSON request and response bodies.

---

# 17. Validation

Zod was introduced to validate incoming booking data.

The booking request validates:

    Parent name
    Parent email
    Parent timezone
    Student name
    Student age
    Start time
    End time

Invalid requests are rejected before booking logic is executed.

---

# 18. MongoDB Connection

MongoDB Atlas was selected for persistence.

The connection string is stored in an environment variable:

    MONGODB_URI=...

The actual `.env` file is excluded from Git.

A `.env.example` file is provided so another developer knows which environment variable is required.

---

# 19. Mentor Seed Data

A seed script was created:

    server/src/utils/seedMentors.ts

The script inserts 10 demo mentors.

Mentors are distributed across:

    Asia/Kolkata
    Europe/London
    America/New_York

This distribution makes timezone-aware scheduling easier to demonstrate.

---

# 20. Testing and Debugging

Several issues were encountered and resolved during development.

### MongoDB Connection

The initial MongoDB connection had IP access restrictions.

The Atlas network configuration was updated so the development environment could connect.

MongoDB Compass was then used to verify the database and collections.

---

### Availability Logic

Availability initially produced slots that were not valid for the mentor's local working day.

The logic was updated to check:

    Mentor local start time
    Mentor local end time
    Mentor local date

This prevented invalid cross-midnight mentor slots.

---

### Booking Capacity

The system was tested with multiple bookings to verify mentor daily limits.

Test bookings were later cleaned from the database.

---

### Student Data Persistence

The frontend initially collected student name and age, but the backend booking model did not store them.

The following layers were updated:

    Booking model
           ↓
    Booking controller
           ↓
    Booking service
           ↓
         MongoDB

After the update, an end-to-end booking was created and verified in MongoDB.

---

# 21. End-to-End Verification

A complete booking was successfully tested through the frontend.

The tested flow was:

    Open Elevora
          ↓
    Select timezone
          ↓
    Select date
          ↓
    Select available slot
          ↓
    Enter parent details
          ↓
    Enter student details
          ↓
    Confirm booking
          ↓
    Success screen
          ↓
    Meeting link displayed
          ↓
    MongoDB document verified

The saved MongoDB booking contained:

    Parent details
    Student details
    Timezone
    Mentor ID
    UTC start time
    UTC end time
    Confirmed status
    Meeting link

---

# 22. Production Build Verification

The backend was tested using:

    npm run build

The TypeScript compiler completed successfully.

The frontend was tested using:

    npm run build

Vite completed the production build successfully.

The final project therefore passed both frontend and backend production compilation.

---

# 23. Environment Configuration

The frontend API URL was moved into an environment variable.

Frontend:

    VITE_API_URL=http://localhost:5000

The application uses:

    VITE_API_URL

instead of hardcoding the backend URL throughout the application.

This makes the frontend easier to configure for deployment.

---

# 24. Git Configuration

A root `.gitignore` was created to prevent unnecessary or sensitive files from being committed.

Ignored files include:

    node_modules/
    dist/
    .env
    *.log

The actual MongoDB connection string is therefore not included in the repository.

---

# 25. AI-Assisted Development

AI assistance was used throughout the development process as a coding and problem-solving assistant.

The AI was used for:

- Project structure planning
- Architecture discussion
- API design
- MongoDB schema design
- Timezone logic
- Availability logic
- Booking validation
- Debugging TypeScript errors
- Frontend implementation guidance
- UI/UX refinement
- README documentation
- Git workflow guidance
- Testing suggestions

The implementation was reviewed and executed locally during development.

---

# 26. AI Guidance Examples

Examples of development guidance included:

    Design a timezone-aware trial booking system.

    Create a layered Express + TypeScript backend.

    Implement mentor availability based on timezone.

    Prevent overlapping mentor bookings.

    Validate student age.

    Store booking timestamps in UTC.

    Create a clean React booking interface.

    Debug TypeScript and build errors.

    Prepare project documentation.

The AI was used primarily to accelerate implementation, debugging, explanation, and documentation.

---

# 27. Important Design Decisions

## Why React + TypeScript?

React provides a component-based UI architecture, while TypeScript improves type safety and maintainability.

## Why Express?

Express provides a lightweight REST API layer suitable for the assessment scope.

## Why MongoDB?

MongoDB provides flexible document storage and integrates cleanly with Mongoose.

## Why Luxon?

Luxon provides reliable timezone-aware date and time operations using IANA timezone identifiers.

## Why Zod?

Zod provides runtime validation for API input while maintaining a clean TypeScript development experience.

---

# 28. Current Scope

The completed application includes:

    ✓ Responsive booking UI
    ✓ Timezone selection
    ✓ Date selection
    ✓ Available slots
    ✓ Mentor availability
    ✓ Mentor capacity limits
    ✓ Conflict prevention
    ✓ Parent details
    ✓ Student details
    ✓ Student age validation
    ✓ Automatic mentor assignment
    ✓ MongoDB persistence
    ✓ Meeting link generation
    ✓ Booking confirmation
    ✓ Mentor directory
    ✓ REST API
    ✓ Production builds

---

# 29. Future Improvements

Possible production improvements include:

    • Real Google Meet or Zoom integration
    • Email confirmation
    • Calendar invitations
    • Parent authentication
    • Booking history
    • Cancellation
    • Rescheduling
    • Admin dashboard
    • Mentor dashboard
    • Automated tests
    • Monitoring
    • Rate limiting
    • Stronger concurrency protection
    • Production deployment

---

# 30. Final Result

The final Elevora application provides a complete trial-class booking workflow with:

    Timezone-aware scheduling
            +
    Mentor availability
            +
    Booking validation
            +
    MongoDB persistence
            +
    Responsive user experience

The system was tested locally from frontend interaction through backend processing and database persistence.

---

## Developer

**Chethan C. Malli**

Elevora — Trial Class Booking Platform

Assessment project for CodeYoung