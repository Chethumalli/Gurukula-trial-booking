# Gurukula — Complete AI Development Transcript

## Project Information

**Project Name:** Gurukula — Trial Class Booking Platform

**Assessment:** CodeYoung Full-Stack Assessment

**Developer:** Chethan C. Malli

**Date:** September 2026

**Purpose:** Full-stack trial class booking platform with timezone-aware scheduling, mentor assignment, booking validation, demo classroom experience, and production deployment.

---

# 1. Project Objective

## User Prompt

I need to build a full-stack trial class booking platform for the CodeYoung assessment.

The application should allow parents to:

- Select their timezone.
- Select a preferred date.
- View available trial class slots.
- Enter parent details.
- Enter student details.
- Book a trial class.
- Automatically assign an available mentor.
- Handle mentors and parents in different timezones.
- Support daylight saving time.
- Limit mentors to a maximum of two demo classes per day.
- Show an appropriate error when no mentor is available.
- Provide a dummy class link after booking.

## AI Response

The project should be designed as a full-stack scheduling application with:

- React frontend
- Node.js and Express backend
- MongoDB database
- Luxon for timezone-aware scheduling
- REST APIs
- Mentor availability logic
- UTC-based booking storage
- Automatic mentor assignment
- Booking conflict prevention
- Demo class experience

The application should treat the parent's selected timezone as the display timezone while storing booking timestamps in UTC.

Mentor availability should be calculated by converting the requested parent-local time into the mentor's local timezone and checking:

1. Working day
2. Working hours
3. Daily booking capacity
4. Existing booking conflicts
5. Cross-midnight conditions
6. Mentor active status

---

# 2. Technology Selection

## User Prompt

Which technology stack should be used for the project?

## AI Response

A suitable stack for the assessment is:

Frontend:

- React
- TypeScript
- Vite
- Tailwind CSS

Backend:

- Node.js
- Express.js
- TypeScript

Database:

- MongoDB Atlas
- Mongoose

Supporting libraries:

- Luxon for timezone and DST handling
- Zod for backend request validation

Deployment:

- Vercel for the frontend
- Render for the backend
- MongoDB Atlas for the database

This stack keeps the application simple, scalable, and appropriate for the assessment requirements.

---

# 3. Project Structure

## User Prompt

Create a clean project structure with separate frontend and backend applications.

## AI Response

The recommended structure was:

    gurukula-trial-booking/
    │
    ├── client/
    │   ├── public/
    │   ├── src/
    │   │   ├── App.tsx
    │   │   ├── App.css
    │   │   ├── index.css
    │   │   └── main.tsx
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
    ├── README.md
    └── TRANSCRIPT.md

The frontend and backend should remain independently deployable.

---

# 4. Frontend Development

## User Prompt

Create a clean and modern booking interface for parents.

## AI Response

The booking experience should use a simple four-step flow:

    Step 1
    Choose Timezone
          ↓
    Step 2
    Choose Date & Time
          ↓
    Step 3
    Enter Parent & Student Details
          ↓
    Step 4
    Review and Confirm

The interface should be responsive and parent-friendly.

The design should provide:

- Clear headings
- Simple navigation
- Visible selected timezone
- Available time slots
- Form validation
- Booking confirmation
- Error messages
- Mentor information
- Demo class access after booking

The frontend was implemented using React, TypeScript, Vite, and Tailwind CSS.

---

# 5. Product Branding

## User Prompt

Change the project branding to Gurukula.

## AI Response

The application branding was updated to:

    Gurukula

Tagline:

    Personalized learning. Real progress.

The visible application branding should use Gurukula.

The existing deployment URLs should remain unchanged because they are deployment addresses rather than visible product branding.

The footer was updated to include:

    © 2026 Gurukula · Assessment project for CodeYoung

    Developed by Chethan C. Malli

A View Portfolio button was also added.

Portfolio:

    https://chethumalli-portfolio.vercel.app/

---

# 6. Mentor Directory

## User Prompt

Add a mentor directory with multiple mentors.

## AI Response

The application can include 10 demo mentors.

Example mentor information:

- Name
- Role
- Timezone
- Experience
- Education
- Languages
- Specialties
- Student age focus

The mentor directory should be a product-exploration feature.

Parents do not need to manually select a mentor during booking.

The backend should automatically determine which mentor is eligible for the selected time.

---

# 7. Mentor Database Model

## User Prompt

Create a MongoDB mentor model.

## AI Response

The mentor model should contain:

    name
    email
    timezone
    workingHours
    workingDays
    isActive

The mentor's timezone is important because working hours must be evaluated in the mentor's local timezone.

---

# 8. Booking Database Model

## User Prompt

Create a MongoDB booking model.

## AI Response

The booking model should store:

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
    classLink
    status

The timestamps should be stored in UTC.

This creates a consistent source of truth while supporting parents and mentors in different timezones.

---

# 9. Timezone Handling

## User Prompt

Implement timezone-aware scheduling and DST support.

## AI Response

Use Luxon with IANA timezone identifiers.

Examples:

    Asia/Kolkata
    Europe/London
    America/New_York
    America/Chicago
    America/Los_Angeles

The conversion flow should be:

    Parent Local Time
          ↓
    Parent IANA Timezone
          ↓
    Luxon
          ↓
    UTC
          ↓
    MongoDB

When checking mentor availability:

    Parent Local Time
          ↓
    Convert to UTC
          ↓
    Convert UTC to Mentor Timezone
          ↓
    Check Mentor Local Date
          ↓
    Check Mentor Working Hours
          ↓
    Check Capacity
          ↓
    Check Booking Conflict

IANA timezones should be used instead of manually configured UTC offsets because offsets can change due to daylight saving time.

---

# 10. Availability Service

## User Prompt

Create an availability service that returns available trial slots.

## AI Response

The availability service should:

1. Fetch active mentors.
2. Generate 60-minute trial slots.
3. Interpret the selected date in the parent's timezone.
4. Convert each slot to UTC.
5. Convert the UTC slot into each mentor's timezone.
6. Check the mentor's local working day.
7. Check the mentor's working hours.
8. Check the mentor's daily booking capacity.
9. Check overlapping confirmed bookings.
10. Return the slots with available mentor information.

The backend should be responsible for deciding actual availability rather than trusting the frontend.

---

# 11. 60-Minute Trial Classes

## User Prompt

The assessment requires trial classes to have a defined duration.

## AI Response

Use a 60-minute trial duration.

For each slot:

    startTimeUTC
    +
    60 minutes
    =
    endTimeUTC

The backend should validate the duration rather than relying only on frontend values.

---

# 12. Mentor Working Hours

## User Prompt

How should mentor working hours be handled?

## AI Response

Working hours must be evaluated in the mentor's local timezone.

For example:

    Parent Time
         ↓
    UTC
         ↓
    Mentor Timezone
         ↓
    Mentor Local Time
         ↓
    Working Hours Check

A mentor should only be considered available when the complete 60-minute trial falls within the mentor's configured working window.

---

# 13. Daily Mentor Capacity

## User Prompt

The assessment says a mentor can conduct a maximum of two demo classes per day. Implement this.

## AI Response

The backend should count confirmed bookings for the mentor's local calendar day.

The process is:

    UTC Booking
         ↓
    Mentor Timezone
         ↓
    Mentor Local Date
         ↓
    Count Confirmed Bookings
         ↓
    Compare With Daily Limit

If the mentor already has two confirmed bookings for that local day, the mentor should not be returned as available.

---

# 14. Booking Conflict Prevention

## User Prompt

Prevent two bookings from being assigned to the same mentor at overlapping times.

## AI Response

Use interval overlap checking.

The overlap condition is:

    Existing Start < New End
    AND
    Existing End > New Start

If both conditions are true, the booking overlaps.

The mentor should then be excluded from the available mentor list.

---

# 15. Cross-Midnight Protection

## User Prompt

Prevent a trial booking from crossing into a different mentor calendar day.

## AI Response

After converting the booking into the mentor's timezone, compare the local dates.

    Mentor Start Local Date
              ==
    Mentor End Local Date

If the dates differ, the mentor should not be considered available for that slot.

This prevents a 60-minute booking from incorrectly consuming capacity across two mentor calendar days.

---

# 16. Student Validation

## User Prompt

The platform should collect the student's name and age.

## AI Response

The frontend should collect:

    Student Name
    Student Age

The supported age range is:

    6 to 17

The backend should validate the age as well so invalid API requests cannot bypass frontend validation.

---

# 17. Zod Validation

## User Prompt

Add backend request validation.

## AI Response

Zod can be used to validate:

    Parent Name
    Parent Email
    Parent Timezone
    Student Name
    Student Age
    Start Time
    End Time

Invalid requests should return an appropriate API error before booking logic executes.

This provides backend protection even if the frontend validation is bypassed.

---

# 18. API Design

## User Prompt

Create REST API endpoints for the booking system.

## AI Response

The main endpoints are:

    GET /api/health

    GET /api/availability?date=YYYY-MM-DD&timezone=IANA_TIMEZONE

    POST /api/bookings

Example availability request:

    /api/availability?date=2026-09-27&timezone=Asia%2FKolkata

Example booking request:

    POST /api/bookings

    {
      "parentName": "Test Parent",
      "parentEmail": "parent@example.com",
      "parentTimezone": "Asia/Kolkata",
      "studentName": "Test Student",
      "studentAge": 12,
      "startTimeUTC": "2026-09-27T04:30:00.000Z",
      "endTimeUTC": "2026-09-27T05:30:00.000Z"
    }

---

# 19. Backend Layered Architecture

## User Prompt

Keep the backend maintainable and separated into layers.

## AI Response

Use:

    Routes
       ↓
    Controllers
       ↓
    Services
       ↓
    Models
       ↓
    MongoDB

Routes define endpoints.

Controllers handle HTTP requests and responses.

Services contain business logic such as:

- Availability calculation
- Mentor matching
- Booking validation
- Booking creation
- Timezone processing

Models define MongoDB structures.

Utilities contain reusable functionality such as timezone helpers and seed scripts.

---

# 20. MongoDB Atlas Setup

## User Prompt

Connect the backend to MongoDB Atlas.

## AI Response

Store the MongoDB connection string in an environment variable:

    MONGODB_URI=your_mongodb_connection_string

The actual `.env` file should never be committed to GitHub.

A `.env.example` file should document the required variables.

MongoDB Compass can be used to verify the connection and inspect collections during development.

---

# 21. Mentor Seed Data

## User Prompt

Create initial mentor data for the assessment.

## AI Response

Create a seed script that inserts 10 demo mentors.

The mentors should be distributed across multiple timezones, including:

    Asia/Kolkata
    Europe/London
    America/New_York

This provides enough data to demonstrate timezone-aware scheduling.

---

# 22. MongoDB Connection Debugging

## User Prompt

The MongoDB connection is not working from the development environment.

## AI Response

Check the MongoDB Atlas network access configuration.

Verify:

- MongoDB URI
- Username
- Password
- Cluster address
- Database name
- Network access rules

After updating the Atlas configuration, verify the connection using the application and MongoDB Compass.

---

# 23. Availability Debugging

## User Prompt

Availability is producing invalid slots for mentors.

## AI Response

The availability calculation should not rely only on the parent's local date and time.

For each slot:

    Parent Local Time
          ↓
    UTC
          ↓
    Mentor Local Time
          ↓
    Mentor Local Date
          ↓
    Mentor Working Hours

The mentor's local date and working hours must be checked after timezone conversion.

This resolves cases where the parent and mentor are in different calendar days.

---

# 24. Booking Capacity Testing

## User Prompt

Test the mentor daily capacity.

## AI Response

Create test bookings for the same mentor and local calendar day.

After the configured daily limit is reached, that mentor should no longer appear as eligible.

Test bookings should be removed after verification so the database remains clean for final assessment testing.

---

# 25. Student Data Persistence Issue

## User Prompt

The frontend collects student information but it is not being stored correctly.

## AI Response

The student fields need to exist across all layers:

    Frontend Request
          ↓
    Controller
          ↓
    Booking Service
          ↓
    Booking Model
          ↓
    MongoDB

The booking model should contain:

    studentName
    studentAge

The API request should send both fields and the backend should persist them.

---

# 26. Frontend and Backend Contract

## User Prompt

Make sure the frontend and backend responses match.

## AI Response

Review the complete API contract.

The frontend should receive the fields it needs for:

- Booking confirmation
- Mentor information
- Booking date
- Booking time
- Demo class access

The backend should remain the authoritative source for:

- Availability
- Mentor assignment
- Booking creation
- Booking validation

The frontend should not independently decide whether a mentor is actually available.

---

# 27. Demo Class Feature

## User Prompt

Add a demo class experience after successful booking. A real meeting service is not required.

## AI Response

A simulated demo classroom can be implemented because the assessment allows a dummy class link.

The flow should be:

    Booking Confirmed
          ↓
    Try Demo Class
          ↓
    Demo Classroom
          ↓
    Start Demo Class
          ↓
    Leave Demo
          ↓
    Gurukula Home Page

The demo should provide a realistic post-booking experience without requiring Google Meet, Zoom, or another video service.

---

# 28. Demo Class New-Tab Experience

## User Prompt

Make the Try Demo Class button open the demo in a new browser tab.

## AI Response

Generate a demo URL from the current application origin:

    /?demo=1

Open it using a new browser tab.

The existing booking page remains available in the original tab.

The application should distinguish between:

    Normal URL
          ↓
    Booking Page

and:

    ?demo=1
          ↓
    Demo Classroom

---

# 29. Demo Booking Data

## User Prompt

The demo classroom needs the booking information after opening in a new tab.

## AI Response

Use browser local storage for the simulated demo experience.

Store information such as:

    Parent Name
    Student Name
    Student Age
    Mentor Name
    Mentor Timezone
    Selected Date
    Selected Time
    Parent Timezone
    Booking ID

The demo classroom can read this data when it loads.

This avoids requiring another backend endpoint solely for the simulated classroom.

---

# 30. Demo Classroom

## User Prompt

Create a classroom-style page for the demo experience.

## AI Response

The demo classroom should:

- Display booking information.
- Display student information.
- Display mentor information.
- Show selected date and time.
- Show the parent timezone.
- Provide a simulated class environment.
- Provide a clear Start Demo Class action.
- Provide a Leave Demo action.

The classroom is intentionally simulated rather than connected to a real video provider.

---

# 31. Leave Demo Navigation

## User Prompt

The Leave Demo button should return to the Gurukula home page.

## AI Response

The Leave Demo action should navigate to the application root:

    /

This returns the user to the main Gurukula booking page.

The flow becomes:

    Demo Classroom
          ↓
    Leave Demo
          ↓
    /
          ↓
    Gurukula Home Page

---

# 32. Demo Refresh Handling

## User Prompt

Make sure the demo classroom still works if the page is refreshed.

## AI Response

The demo classroom should retrieve the booking data from local storage when it loads.

If the data exists:

    Load Demo Booking
          ↓
    Display Classroom

If the data does not exist:

    Show Demo Unavailable State
          ↓
    Provide Navigation Back to Gurukula

This prevents the classroom from depending entirely on React state from the previous page.

---

# 33. Footer and Portfolio

## User Prompt

Add a View Portfolio button to the footer.

## AI Response

Add a footer containing:

    Gurukula
    Personalized learning. Real progress.
    Assessment project for CodeYoung
    Developed by Chethan C. Malli
    View Portfolio

Portfolio:

    https://chethumalli-portfolio.vercel.app/

The portfolio link should open separately so it does not interrupt the main booking workflow.

---

# 34. End-to-End Booking Verification

## User Prompt

Verify the complete booking flow.

## AI Response

The complete flow should be tested:

    Open Gurukula
          ↓
    Select Timezone
          ↓
    Select Date
          ↓
    Select Available Slot
          ↓
    Enter Parent Details
          ↓
    Enter Student Details
          ↓
    Review Booking
          ↓
    Confirm Booking
          ↓
    Booking Confirmation
          ↓
    Try Demo Class
          ↓
    Demo Opens in New Tab
          ↓
    Demo Classroom
          ↓
    Leave Demo
          ↓
    Gurukula Home Page

MongoDB should also be checked to confirm that the booking was persisted correctly.

---

# 35. Production Build Verification

## User Prompt

Verify that the project builds successfully.

## AI Response

Backend build:

    cd server
    npm run build

Frontend build:

    cd client
    npm run build

Both builds should complete successfully before deployment.

---

# 36. Environment Configuration

## User Prompt

Move the backend URL into an environment variable.

## AI Response

Use:

    VITE_API_URL

For local development:

    VITE_API_URL=http://localhost:5000

For production:

    VITE_API_URL=https://elevora-api.onrender.com

This prevents the backend URL from being hardcoded throughout the frontend.

---

# 37. Windows `run.bat` Script

## User Prompt

Can you create a BAT file to run the complete project?

## AI Response

A Windows startup script was created to start both frontend and backend development servers.

The project can be started from the root directory using:

    .\run.bat

The script starts:

    Gurukula Backend
    Gurukula Frontend

and opens:

    http://localhost:5173

The backend runs at:

    http://localhost:5000

The script was tested successfully on Windows.

---

# 38. Running the Project With `run.bat`

## User Prompt

PowerShell says `run.bat` is not recognized when I type `run.bat`.

## AI Response

Windows PowerShell does not execute files from the current directory by default.

Use:

    .\run.bat

Instead of:

    run.bat

If needed, check the available BAT files using:

    dir *.bat

The project was then successfully started using:

    .\run.bat

---

# 39. Git Configuration

## User Prompt

Prepare the project for GitHub.

## AI Response

The repository should contain:

    client/
    server/
    run.bat
    README.md
    TRANSCRIPT.md
    .gitignore

The `.gitignore` should exclude:

    node_modules/
    dist/
    .env
    *.log

Secrets such as MongoDB credentials should never be committed.

---

# 40. Production Deployment Plan

## User Prompt

Deploy the application to Vercel and Render.

## AI Response

Use the following architecture:

    User
      |
      v
    Vercel
    React + Vite
      |
      v
    Render
    Node.js + Express
      |
      v
    MongoDB Atlas

The frontend uses:

    VITE_API_URL=https://elevora-api.onrender.com

The backend uses the MongoDB Atlas connection string through its environment configuration.

---

# 41. Frontend Deployment

## User Prompt

Deploy the frontend.

## AI Response

The React/Vite frontend can be deployed using Vercel.

The production frontend deployment is:

    https://gurukula-trial-booking.vercel.app

The visible product branding remains Gurukula.

The deployment URL retains the existing deployment name.

---

# 42. Backend Deployment

## User Prompt

Deploy the backend.

## AI Response

The Node.js and Express backend can be deployed using Render.

The production backend is:

    https://elevora-api.onrender.com

The Vercel frontend should use this URL through:

    VITE_API_URL

---

# 43. Production Verification

## User Prompt

Verify the deployed application.

## AI Response

The deployed system should be checked end to end:

- Open the Vercel frontend.
- Confirm the UI loads.
- Select a timezone.
- Select a date.
- Load availability.
- Select a slot.
- Enter parent details.
- Enter student details.
- Confirm the booking.
- Verify backend communication.
- Verify MongoDB persistence.
- Open Try Demo Class.
- Confirm the demo opens in a new tab.
- Test the demo classroom.
- Test Leave Demo.
- Confirm return to the Gurukula home page.
- Test the View Portfolio button.

The production architecture is:

    Vercel
       ↓
    Render
       ↓
    MongoDB Atlas

---

# 44. README Documentation

## User Prompt

Create a professional README for the project.

## AI Response

The README should document:

- Project overview
- Features
- Tech stack
- Live deployment
- Architecture
- Frontend
- Backend
- Demo classroom
- Footer and portfolio
- Timezone handling
- Mentor availability
- API endpoints
- Project structure
- Local setup
- `run.bat`
- Production deployment
- Production builds
- Validation and testing
- Design decisions
- Booking flow
- DST handling
- Conflict prevention
- Mentor capacity
- API architecture
- Current limitations
- Future improvements
- Security considerations
- Author
- Assessment information
- License

The README was updated to use Gurukula branding while preserving the existing deployment URLs.

---

# 45. README Local Startup Documentation

## User Prompt

Add the BAT command to the README.

## AI Response

The README should include:

    ## Running Locally

    ### Run Using run.bat

    From the project root:

        .\run.bat

The script starts both services.

Default URLs:

    Frontend: http://localhost:5173
    Backend:  http://localhost:5000

Manual startup commands should also remain documented:

    cd server
    npm run dev

and:

    cd client
    npm run dev

---

# 46. Transcript Documentation

## User Prompt

The assessment requires a full transcript of AI sessions containing prompts and agent responses.

## AI Response

The project should include a `TRANSCRIPT.md` file documenting the AI-assisted development process.

The transcript should cover:

- Project objective
- Technology selection
- Architecture
- Frontend development
- Backend development
- Database design
- Timezone implementation
- Availability logic
- Mentor capacity
- Booking conflicts
- Validation
- Demo classroom
- New-tab experience
- Leave Demo navigation
- Footer and portfolio
- Debugging
- Testing
- `run.bat`
- Production deployment
- README documentation
- AI-assisted development
- Final application workflow

The transcript should clearly distinguish user requests from AI guidance.

---

# 47. Final AI-Assisted Development Summary

## User Prompt

Summarize how AI was used in the project.

## AI Response

AI assistance was used as a development and problem-solving assistant throughout the project.

AI guidance covered:

- Project planning
- Technology selection
- Architecture
- Frontend implementation
- Backend implementation
- MongoDB schema design
- API design
- Timezone calculations
- Mentor availability
- Booking conflict prevention
- Daily mentor capacity
- Zod validation
- Debugging
- TypeScript issues
- UI/UX refinement
- Demo classroom implementation
- Navigation
- Local storage handling
- Windows development automation
- Production deployment
- README preparation
- Transcript preparation

The code was implemented, tested, debugged, and verified during development.

---

# 48. Final Application Scope

The completed Gurukula application includes:

    ✓ Responsive booking UI

    ✓ Timezone selection

    ✓ Date selection

    ✓ Available trial slots

    ✓ 60-minute trial classes

    ✓ Mentor availability

    ✓ Mentor working hours

    ✓ Mentor working days

    ✓ Maximum two confirmed demo classes per mentor per local day

    ✓ Booking conflict prevention

    ✓ Cross-midnight protection

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

    ✓ Mentor category filtering

    ✓ REST API

    ✓ Zod validation

    ✓ Luxon timezone handling

    ✓ IANA timezone support

    ✓ DST-aware calculations

    ✓ Footer branding

    ✓ View Portfolio button

    ✓ Windows run.bat startup script

    ✓ Vercel frontend deployment

    ✓ Render backend deployment

    ✓ MongoDB Atlas database

    ✓ Production API configuration

    ✓ Production builds

---

# 49. Final Customer Journey

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
    Reviews Booking
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
    View Portfolio Available in Footer

This provides a complete customer experience from selecting a trial class to booking, confirmation, simulated classroom access, and returning to the main application.

---

# 50. Final Technical Architecture

The final system architecture is:

    ┌─────────────────────────────┐
    │           Parent            │
    │        Web Browser          │
    └──────────────┬──────────────┘
                   │
                   ▼
    ┌─────────────────────────────┐
    │           Vercel            │
    │      React + TypeScript     │
    │           Vite              │
    │       Tailwind CSS          │
    └──────────────┬──────────────┘
                   │
                   │ REST API
                   ▼
    ┌─────────────────────────────┐
    │           Render            │
    │      Node.js + Express      │
    │        TypeScript           │
    │                             │
    │  Routes → Controllers       │
    │          → Services         │
    │          → Models           │
    └──────────────┬──────────────┘
                   │
                   ▼
    ┌─────────────────────────────┐
    │       MongoDB Atlas         │
    │                             │
    │        Mentors              │
    │        Bookings             │
    └─────────────────────────────┘

Timezone processing is handled by Luxon.

Request validation is handled by Zod.

---

# 51. Live Deployment

The final application is publicly deployed.

Frontend:

    https://gurukula-trial-booking.vercel.app

Backend:

    https://elevora-api.onrender.com

Portfolio:

    https://chethumalli-portfolio.vercel.app/

The frontend communicates with the backend using:

    VITE_API_URL=https://elevora-api.onrender.com

The deployment demonstrates the complete application flow from frontend interaction through backend processing, database persistence, booking confirmation, and demo classroom access.

---

# 52. Final Result

The final Gurukula application provides a complete trial-class booking workflow with:

    Timezone-aware scheduling
            +
    IANA timezone support
            +
    DST-aware calculations
            +
    Mentor availability
            +
    Mentor working hours
            +
    Mentor daily capacity
            +
    Booking conflict prevention
            +
    Student validation
            +
    Automatic mentor assignment
            +
    MongoDB persistence
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
    Windows run.bat startup
            +
    Vercel frontend deployment
            +
    Render backend deployment
            +
    MongoDB Atlas database
            +
    Responsive user experience

The application was developed with AI-assisted planning, implementation guidance, debugging, testing guidance, documentation, and deployment support.

The final system was tested locally and deployed to production.

---

# 53. Live Deployment Summary

The completed application uses the following architecture:

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

    https://gurukula-trial-booking.vercel.app

Live Backend:

    https://elevora-api.onrender.com

Portfolio:

    https://chethumalli-portfolio.vercel.app/

Local Development:

    .\run.bat

Local Frontend:

    http://localhost:5173

Local Backend:

    http://localhost:5000

---

# 54. Final Project Status

The Gurukula trial class booking platform is completed for the CodeYoung Full-Stack Assessment.

The final submission includes:

    README.md
    TRANSCRIPT.md
    client/
    server/
    run.bat

The application demonstrates:

- Full-stack development
- React and TypeScript
- Node.js and Express
- MongoDB and Mongoose
- REST API architecture
- Timezone-aware scheduling
- IANA timezone handling
- DST-aware calculations
- Mentor availability
- Mentor daily capacity
- Booking conflict prevention
- Backend validation
- Automatic mentor assignment
- Simulated online classroom
- Responsive UI
- Local development automation
- Production deployment
- AI-assisted development workflow

---

# Developer

**Chethan C. Malli**

AI/ML Enthusiast | Full-Stack Developer

GitHub:

https://github.com/Chethumalli

Portfolio:

https://chethumalli-portfolio.vercel.app/

**Gurukula — Trial Class Booking Platform**

Assessment project for CodeYoung

© 2026 Gurukula