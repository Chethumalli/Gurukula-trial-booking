# TRANSCRIPT.md

# Elevora — Development Transcript

## Project

**Project Name:** Gurukula — Trial Class Booking Platform

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
7. Receive a booking confirmation.
8. Open a simulated demo class experience.
9. Leave the demo class and return to the Gurukula home page.

The backend is responsible for calculating mentor availability, validating booking requests, assigning an eligible mentor, and creating the booking.

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

### Deployment

- Vercel for frontend deployment
- Render for backend deployment
- MongoDB Atlas for cloud database

---

# 3. Initial Project Structure

The project was organized into separate frontend and backend applications.

    Gurukula-trial-booking/

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

The application was later extended with a separate demo classroom experience that can be opened after a successful booking.

---

# 5. Product Branding

The application was branded as:

## Gurukula

Tagline:

> Personalized learning. Real progress.

The branding was chosen to give the application a standalone product identity rather than presenting it as an internal CodeYoung application.

The footer identifies the project as:

    © 2026 Gurukula · Assessment project for CodeYoung

    Developed by Chethan C. Malli

A **View Portfolio** button was also added to the footer to provide quick access to the developer's portfolio.

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

           ↓

    Booking Confirmation

           ↓

    Try Demo Class

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

The main services include:

    availability.service.ts

    booking.service.ts

    timezone utilities

### Models

Mongoose models define the database structure.

    Mentor

    Booking

---

# 9. Database Design

Two main MongoDB collections were used.

## Mentors

The mentor document contains information such as:

    name

    email

    timezone

    workingHours

    workingDays

    isActive

## Bookings

The booking document contains:

    parentName

    parentEmail

    parentTimezone

    studentName

    studentAge

    mentorId

    mentorName

    mentorTimezone

    startTimeUTC

    endTimeUTC

    status

    classLink

The booking information is stored in MongoDB after successful validation and mentor assignment.

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

The mentor's local working hours and local calendar day are then checked.

---

# 11. Working Hours

The mentor availability system uses a defined working window.

The demo mentors are configured with working hours that allow the backend to determine whether a selected parent slot can be handled by a particular mentor.

Each trial class lasts:

    60 minutes

A mentor cannot be assigned if the selected booking falls outside their working window.

The working-hours check is performed using the mentor's local timezone rather than the parent's timezone.

---

# 12. Daily Booking Capacity

Each mentor has a maximum daily booking limit.

The assessment requirement limits a mentor to a maximum of two demo classes per day.

The backend therefore checks the mentor's local calendar day before assigning a booking.

Before creating a booking, the backend counts confirmed bookings for that mentor's local calendar day.

If the maximum has been reached, that mentor is skipped.

This prevents a mentor from being assigned more than the allowed number of demo classes in a local day.

---

# 13. Overlapping Booking Prevention

The booking service checks whether the requested interval overlaps an existing confirmed booking.

The overlap condition is effectively:

    Existing start < New end

    AND

    Existing end > New start

If an overlap is found, the mentor is not assigned.

This prevents two confirmed bookings from occupying the same mentor at the same time.

---

# 14. Cross-Midnight Protection

A booking should not cross into another mentor's local calendar day.

A validation check was added to ensure:

    mentorStart local date

    ==

    mentorEnd local date

If the dates are different, the mentor is skipped.

This keeps the availability calculation and booking creation logic consistent with the mentor's local calendar.

---

# 15. Student Validation

The frontend collects:

    Student Name

    Student Age

The supported age range is:

    6 — 17

The backend validates the booking request before creating the booking.

This prevents invalid student information from being accepted by the booking API.

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

This provides a second layer of protection in addition to frontend validation.

---

# 18. MongoDB Connection

MongoDB Atlas was selected for persistence.

The connection string is stored in an environment variable:

    MONGODB_URI=...

The actual `.env` file is excluded from Git.

A `.env.example` file is provided so another developer knows which environment variable is required.

---

# 19. Mentor Seed Data

A seed script was created for the initial mentor data.

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

### Frontend and Backend Contract

During development, the frontend and backend booking response structures were reviewed to make sure the information required by the confirmation screen was available.

The booking confirmation uses the successful booking response to display the confirmation state and provide access to the demo class experience.

---

### Demo Class Navigation

The demo class feature was added after the main booking workflow was completed.

The frontend was structured so that:

    Normal URL

        ↓

    Booking Page

and:

    ?demo=1

        ↓

    Demo Classroom

This keeps the booking experience and demo classroom experience separate while allowing both to exist within the same React application.

---

# 21. Demo Class Feature

A simulated demo class experience was added after the booking flow was completed.

The assessment allows a dummy class link, so a real video-conferencing integration was not required.

The demo class provides a realistic next step after booking confirmation.

The flow is:

    Booking Confirmed

          ↓

    Try Demo Class

          ↓

    Open Demo in New Tab

          ↓

    Demo Classroom

          ↓

    Start Demo Class

          ↓

    Leave Demo

          ↓

    Gurukula Home Page

---

# 22. Demo Class New-Tab Experience

The **Try Demo Class** action opens the demo classroom in a new browser tab.

This was implemented to make the experience closer to a real online class platform.

The original booking page remains available in the previous browser tab.

The demo classroom can therefore be treated as a separate classroom experience without losing the original booking page.

---

# 23. Demo Booking Data

The booking information required by the demo classroom is temporarily stored in browser local storage.

The stored information can include:

    Parent Name

    Student Name

    Student Age

    Mentor Name

    Mentor Timezone

    Selected Date

    Selected Time

    Parent Timezone

    Booking Information

This allows the demo classroom to retrieve the booking information after it is opened in a new browser tab.

---

# 24. Demo Classroom Page

The demo classroom was implemented as a dedicated frontend view.

The classroom provides a simulated online learning environment rather than a real video-conference connection.

The purpose of the page is to demonstrate what the parent/student experience could look like after successfully booking a trial class.

The classroom can display relevant booking information and provide a clear action to enter or start the demo class.

---

# 25. Leave Demo Navigation

A **Leave Demo** button was added to the demo classroom.

When the user clicks the button:

    Demo Classroom

          ↓

    Leave Demo

          ↓

    /

          ↓

    Gurukula Home Page

The button uses the application's root route so the user can return directly to the main booking experience.

This provides a clear exit path from the demo classroom.

---

# 26. Demo Class Refresh Handling

The demo classroom retrieves its temporary booking information from browser local storage.

This means the demo page can restore the booking information after a page refresh as long as the temporary booking data is still available in the browser.

If no demo booking information is available, the application can show an appropriate unavailable state and provide navigation back to Gurukula.

---

# 27. Footer and Portfolio Feature

The footer was enhanced after the main application flow was completed.

The footer contains:

    Gurukula Branding

    Personalized Learning Tagline

    Assessment Information

    Developer Information

    View Portfolio

The **View Portfolio** button provides a direct navigation path to the developer's portfolio.

Portfolio:

    https://chethumalli-portfolio.vercel.app/

This gives evaluators an easy way to explore the developer's other work without interrupting the booking experience.

---

# 28. End-to-End Verification

A complete booking was successfully tested through the frontend.

The tested flow was:

    Open Gurukula

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

    Try Demo Class

          ↓

    Demo classroom opens

          ↓

    Demo class experience

          ↓

    Leave Demo

          ↓

    Return to Gurukula home page

          ↓

    View Portfolio available in footer

          ↓

    MongoDB booking verified

The saved MongoDB booking contains the booking information required by the backend.

---

# 29. Production Build Verification

The backend was tested using:

    npm run build

The TypeScript compiler completed successfully.

The frontend was tested using:

    npm run build

Vite completed the production build successfully.

The demo class implementation was also checked as part of the frontend development flow.

---

# 30. Environment Configuration

The frontend API URL was moved into an environment variable.

Local development:

    VITE_API_URL=http://localhost:5000

Production:

    VITE_API_URL=https://Gurukula-api.onrender.com

The application uses:

    VITE_API_URL

instead of hardcoding the backend URL throughout the application.

This makes the frontend easier to configure for both local development and production deployment.

---

# 31. Git Configuration

A root `.gitignore` was created to prevent unnecessary or sensitive files from being committed.

Ignored files include:

    node_modules/

    dist/

    .env

    *.log

The actual MongoDB connection string is therefore not included in the repository.

---

# 32. Production Deployment

After completing the local development and testing process, the application was deployed to production.

The deployment architecture is:

    Vercel
    React Frontend
         |
         v
    Render
    Node.js + Express API
         |
         v
    MongoDB Atlas

### Frontend Deployment

The frontend was deployed using Vercel.

Live frontend:

    https://Gurukula-trial-booking.vercel.app

### Backend Deployment

The backend was deployed using Render.

Live backend:

    https://Gurukula-api.onrender.com

### Database

MongoDB Atlas continues to provide the cloud database layer.

### Production API Configuration

The Vercel frontend was configured to communicate with the Render backend using:

    VITE_API_URL=https://Gurukula-api.onrender.com

This allows the deployed frontend to make availability and booking requests to the deployed backend.

---

# 33. Deployment Verification

The deployed application was verified after deployment.

The verification included:

- Opening the Vercel frontend.
- Confirming the frontend loads correctly.
- Connecting the frontend to the Render backend.
- Testing the availability API.
- Testing timezone-aware availability.
- Testing the booking API.
- Confirming MongoDB persistence.
- Testing the booking confirmation screen.
- Testing the Try Demo Class button.
- Confirming the demo opens in a new browser tab.
- Testing the Leave Demo button.
- Confirming Leave Demo returns to the Gurukula home page.
- Confirming the View Portfolio button is available in the footer.

The deployed architecture therefore supports the complete application flow from frontend interaction to backend processing and database persistence.

---

# 34. Live Application

The final application is publicly deployed.

Frontend:

    https://Gurukula-trial-booking.vercel.app

Backend:

    https://Gurukula-api.onrender.com

The deployed application demonstrates the complete Gurukula trial booking experience.

---

# 35. AI-Assisted Development

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
- Demo classroom implementation
- Navigation and user-flow refinement
- Deployment guidance
- README documentation
- Git workflow guidance
- Testing suggestions

The implementation was reviewed and executed locally during development.

---

# 36. AI Guidance Examples

Examples of development guidance included:

    Design a timezone-aware trial booking system.

    Create a layered Express + TypeScript backend.

    Implement mentor availability based on timezone.

    Prevent overlapping mentor bookings.

    Validate student age.

    Store booking timestamps in UTC.

    Create a clean React booking interface.

    Debug TypeScript and build errors.

    Add a demo classroom experience after booking.

    Open the demo class in a new browser tab.

    Add a Leave Demo action that returns to the home page.

    Add a View Portfolio button to the footer.

    Prepare project documentation.

    Prepare the application for Vercel deployment.

    Prepare the backend for Render deployment.

The AI was used primarily to accelerate implementation, debugging, explanation, deployment preparation, and documentation.

---

# 37. Important Design Decisions

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

## Why a Simulated Demo Classroom?

The assessment allows a dummy class link, so a real video-conferencing integration was not necessary.

A simulated classroom provides a complete user journey while keeping the project within the assessment scope.

## Why Open the Demo in a New Tab?

Opening the demo classroom in a new tab makes the transition feel closer to a real online class experience while preserving the original booking page.

## Why Use Local Storage for Demo Data?

The demo classroom is a frontend simulation.

Browser local storage provides a simple way to transfer the confirmed booking information into the new demo tab without requiring another backend API specifically for the demo classroom.

## Why Add a View Portfolio Button?

The View Portfolio button provides evaluators and visitors with direct access to the developer's portfolio.

It keeps the portfolio link visible without adding complexity to the primary booking workflow.

## Why Deploy Using Vercel and Render?

Vercel provides a suitable deployment platform for the React/Vite frontend, while Render provides a suitable environment for the Node.js and Express backend.

Separating the frontend and backend deployments also keeps the application architecture consistent with the local development structure.

---

# 38. Current Scope

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

    ✓ Booking confirmation

    ✓ Demo class experience

    ✓ Demo class opens in a new browser tab

    ✓ Demo booking data persistence

    ✓ Leave Demo navigation

    ✓ Return to Gurukula home page

    ✓ Mentor directory

    ✓ REST API

    ✓ Footer branding

    ✓ View Portfolio button

    ✓ Vercel frontend deployment

    ✓ Render backend deployment

    ✓ MongoDB Atlas cloud database

    ✓ Production API configuration

    ✓ Production builds

---

# 39. Future Improvements

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

    • Real-time classroom functionality

    • Real-time mentor/student video communication

---

# 40. Final User Journey

The final customer journey is:

    Parent Opens Gurukula

             ↓

    Selects Timezone

             ↓

    Selects Date

             ↓

    Views Available Slots

             ↓

    Selects Trial Slot

             ↓

    Enters Parent Details

             ↓

    Enters Student Details

             ↓

    Confirms Booking

             ↓

    Booking Confirmation

             ↓

    Try Demo Class

             ↓

    Demo Opens in New Tab

             ↓

    Demo Classroom

             ↓

    Start Demo Class

             ↓

    Leave Demo

             ↓

    Gurukula Home Page

             ↓

    View Portfolio available in Footer

This provides a complete end-to-end customer experience from discovering a trial class to booking and experiencing a simulated online class.

---

# 41. Final Result

The final Gurukula application provides a complete trial-class booking workflow with:

    Timezone-aware scheduling

            +

    Mentor availability

            +

    Booking validation

            +

    Mentor capacity management

            +

    Conflict prevention

            +

    MongoDB persistence

            +

    Automatic mentor assignment

            +

    Booking confirmation

            +

    Demo classroom experience

            +

    New-tab classroom navigation

            +

    Leave Demo navigation

            +

    Footer portfolio access

            +

    Vercel frontend deployment

            +

    Render backend deployment

            +

    MongoDB Atlas database

            +

    Responsive user experience

The system was tested locally and then deployed to production.

The final customer journey can be completed through the deployed Gurukula application from frontend interaction through backend processing, database persistence, booking confirmation, demo classroom access, and returning to the home page.

---

# 42. Live Deployment Summary

The completed application is publicly deployed using the following architecture:

    User
      |
      v
    Vercel
    Gurukula React Frontend
      |
      v
    Render
    Gurukula Express API
      |
      v
    MongoDB Atlas

Live Frontend:

    https://Gurukula-trial-booking.vercel.app

Live Backend:

    https://Gurukula-api.onrender.com

Portfolio:

    https://chethumalli-portfolio.vercel.app/

The deployment demonstrates that the application is not limited to local development and can be accessed through its public production frontend.

---

## Developer

**Chethan C. Malli**

Gurukula — Trial Class Booking Platform

Assessment project for CodeYoung
