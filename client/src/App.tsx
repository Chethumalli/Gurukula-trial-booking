import { useEffect, useMemo, useState } from "react";
const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";
type TimezoneOption = {
  label: string;
  short: string;
  value: string;
};

type AvailabilitySlot = {
  startTimeUTC: string;
  endTimeUTC: string;
  localDate: string;
  localTime: string;
  availableMentors: number;
};

type Mentor = {
  name: string;
  role: string;
  timezone: string;
  experience: string;
  education: string;
  languages: string;
  specialties: string[];
  ageFocus: string;
  initials: string;
  image: string;
};

type DemoBooking = {
  bookingId?: string;
  parentName: string;
  studentName: string;
  studentAge: number;
  mentorName: string;
  mentorTimezone: string;
  date: string;
  localTime: string;
  timezone: string;
};

const timezones: TimezoneOption[] = [
  {
    label: "India Standard Time",
    short: "IST",
    value: "Asia/Kolkata",
  },
  {
    label: "London, United Kingdom",
    short: "GMT / BST",
    value: "Europe/London",
  },
  {
    label: "Eastern Time, USA",
    short: "ET",
    value: "America/New_York",
  },
  {
    label: "Central Time, USA",
    short: "CT",
    value: "America/Chicago",
  },
  {
    label: "Pacific Time, USA",
    short: "PT",
    value: "America/Los_Angeles",
  },
];

const mentors: Mentor[] = [
{
    name: "Aarav Sharma",
    role: "AI & Coding Mentor",
    timezone: "IST · Asia/Kolkata",
    experience: "5 years mentoring students",
    education: "B.Tech in Computer Science",
    languages: "English, Hindi",
    specialties: ["AI & Coding", "Python"],
    ageFocus: "Ages 10–14",
    initials: "AS",
    image: "/aarav-sharma.jpg",
  },
  {
    name: "Ananya Rao",
    role: "Web Development Mentor",
    timezone: "IST · Asia/Kolkata",
    experience: "4 years mentoring students",
    education: "B.E. in Information Technology",
    languages: "English, Hindi, Kannada",
    specialties: ["Web Development", "JavaScript"],
    ageFocus: "Ages 11–16",
    initials: "AR",
    image: "/ananya-rao.jpg",
  },
  {
    name: "Rahul Nair",
    role: "Senior Coding Mentor",
    timezone: "IST · Asia/Kolkata",
    experience: "6 years mentoring students",
    education: "M.Tech in Computer Science",
    languages: "English, Malayalam, Hindi",
    specialties: ["Python", "Coding"],
    ageFocus: "Ages 10–16",
    initials: "RN",
    image: "/rahul-nair.jpg",
  },
  {
    name: "Priya Menon",
    role: "Creative Coding Mentor",
    timezone: "IST · Asia/Kolkata",
    experience: "4 years mentoring students",
    education: "B.Tech in Computer Science",
    languages: "English, Malayalam",
    specialties: ["Creative Coding", "Scratch"],
    ageFocus: "Ages 7–12",
    initials: "PM",
    image: "/priya-menon.jpg",
  },
  {
    name: "Vikram Singh",
    role: "Python & Robotics Mentor",
    timezone: "GMT · Europe/London",
    experience: "5 years mentoring students",
    education: "M.Sc. Computer Science",
    languages: "English, Hindi",
    specialties: ["Python", "Robotics"],
    ageFocus: "Ages 10–16",
    initials: "VS",
    image: "/vikram-singh.jpg",
  },
  {
    name: "Sneha Patel",
    role: "Web & Creative Coding Mentor",
    timezone: "GMT · Europe/London",
    experience: "4 years mentoring students",
    education: "B.Sc. Software Engineering",
    languages: "English, Gujarati, Hindi",
    specialties: ["Web Development", "Creative Coding"],
    ageFocus: "Ages 8–14",
    initials: "SP",
    image: "/sneha-patel.jpg",
  },
  {
    name: "Arjun Kumar",
    role: "Programming Mentor",
    timezone: "GMT · Europe/London",
    experience: "6 years mentoring students",
    education: "B.Tech in Computer Engineering",
    languages: "English, Hindi",
    specialties: ["Python", "JavaScript"],
    ageFocus: "Ages 12–17",
    initials: "AK",
    image: "/arjun-kumar.jpg",
  },
  {
    name: "Meera Iyer",
    role: "AI & Data Science Mentor",
    timezone: "ET · America/New_York",
    experience: "5 years mentoring students",
    education: "M.S. in Data Science",
    languages: "English, Tamil",
    specialties: ["AI & Coding", "Data Science"],
    ageFocus: "Ages 12–17",
    initials: "MI",
    image: "/meera-iyer.jpg",
  },
  {
    name: "Karan Joshi",
    role: "Robotics & Coding Mentor",
    timezone: "ET · America/New_York",
    experience: "4 years mentoring students",
    education: "M.S. in Robotics",
    languages: "English, Hindi",
    specialties: ["Robotics", "Coding"],
    ageFocus: "Ages 9–15",
    initials: "KJ",
    image: "/karan-joshi.jpg",
  },
  {
    name: "Riya Kapoor",
    role: "Logic & Programming Mentor",
    timezone: "ET · America/New_York",
    experience: "5 years mentoring students",
    education: "B.E. in Computer Science",
    languages: "English, Hindi",
    specialties: ["Programming", "Logic"],
    ageFocus: "Ages 10–16",
    initials: "RK",
    image: "/riya-kapoor.jpg",
  },
];

const mentorFilters = [
  "All Mentors",
  "AI & Coding",
  "Python",
  "Web Development",
  "Robotics",
];

function getTodayDate(): string {
  const today = new Date();

  return `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
}

function Icon({
  name,
  size = 20,
}: {
  name:
    | "globe"
    | "calendar"
    | "clock"
    | "user"
    | "code"
    | "shield"
    | "spark"
    | "arrow"
    | "check"
    | "close"
    | "users";
  size?: number;
}) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (name) {
    case "globe":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <path d="M12 3c3 3 4 6 4 9s-1 6-4 9c-3-3-4-6-4-9s1-6 4-9Z" />
        </svg>
      );

    case "calendar":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <line x1="16" y1="3" x2="16" y2="7" />
          <line x1="8" y1="3" x2="8" y2="7" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      );

    case "clock":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <polyline points="12 7 12 12 15 14" />
        </svg>
      );

    case "user":
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="3.5" />
          <path d="M5 20c.8-3.3 3.1-5 7-5s6.2 1.7 7 5" />
        </svg>
      );

    case "code":
      return (
        <svg {...common}>
          <polyline points="8 9 4 12 8 15" />
          <polyline points="16 9 20 12 16 15" />
          <line x1="14" y1="6" x2="10" y2="18" />
        </svg>
      );

    case "shield":
      return (
        <svg {...common}>
          <path d="M12 3 20 6v5c0 5-3.3 8.4-8 10-4.7-1.6-8-5-8-10V6l8-3Z" />
          <polyline points="8 12 11 15 16 9" />
        </svg>
      );

    case "spark":
      return (
        <svg {...common}>
          <path d="m12 2 1.7 6.3L20 10l-6.3 1.7L12 18l-1.7-6.3L4 10l6.3-1.7L12 2Z" />
        </svg>
      );

    case "arrow":
      return (
        <svg {...common}>
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="13 6 19 12 13 18" />
        </svg>
      );

    case "check":
      return (
        <svg {...common}>
          <polyline points="5 12 10 17 19 7" />
        </svg>
      );

    case "close":
      return (
        <svg {...common}>
          <line x1="6" y1="6" x2="18" y2="18" />
          <line x1="18" y1="6" x2="6" y2="18" />
        </svg>
      );

    case "users":
      return (
        <svg {...common}>
          <circle cx="9" cy="9" r="3" />
          <circle cx="17" cy="10" r="2.5" />
          <path d="M3 20c.7-3.3 2.7-5 6-5s5.3 1.7 6 5" />
          <path d="M15 15c2.8.1 4.5 1.7 5 4" />
        </svg>
      );
  }
}

function DemoClassPage() {
  const [booking, setBooking] = useState<DemoBooking | null>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("elevora-demo-booking");
      if (saved) {
        setBooking(JSON.parse(saved) as DemoBooking);
      }
    } catch {
      setBooking(null);
    }
  }, []);

  if (!booking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-5 text-white">
        <div className="w-full max-w-lg rounded-[28px] border border-white/10 bg-white/[0.06] p-8 text-center shadow-2xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-lg font-black text-slate-950">
            E
          </div>
          <h1 className="mt-6 text-3xl font-black">Demo class unavailable</h1>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            Please return to the Elevora booking page and open the demo class from your booking confirmation.
          </p>
          <a
            href="/"
            className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-bold text-slate-950 transition hover:bg-slate-200"
          >
            Back to Elevora
            <Icon name="arrow" size={16} />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f8fc] text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-sm font-black text-white">
              E
            </div>
            <div>
              <div className="text-lg font-bold tracking-tight">Elevora</div>
              <div className="text-[11px] font-medium text-slate-400">Demo Classroom</div>
            </div>
          </div>

          <div className="rounded-full bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700">
            Free Trial · 60 min
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8 lg:px-8 lg:py-10">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-500">
              Elevora Demo Classroom
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              {started ? "Your trial class is ready" : "Welcome to your trial class"}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              This is a demo classroom for the assessment. In a production version, this area can connect to a live video classroom.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-400 bg-white px-5 py-4 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Scheduled for
            </p>
            <p className="mt-1 text-sm font-bold">
              {booking.date} · {booking.localTime}
            </p>
            <p className="mt-1 text-xs text-slate-500">{booking.timezone}</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
          <section className="overflow-hidden rounded-[28px] bg-slate-950 shadow-xl">
            <div className="relative flex min-h-[480px] items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-6 sm:p-10">
              <div className="absolute left-5 top-5 rounded-full border border-white/10 bg-white/[0.07] px-3 py-1.5 text-[11px] font-bold text-slate-300">
                DEMO CLASSROOM
              </div>

              <div className="w-full max-w-xl text-center">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-white text-2xl font-black text-slate-950 shadow-2xl">
                  {booking.mentorName
                    .split(" ")
                    .map((part) => part[0])
                    .slice(0, 2)
                    .join("")}
                </div>

                <p className="mt-7 text-xs font-bold uppercase tracking-[0.2em] text-indigo-300">
                  Your mentor
                </p>
                <h2 className="mt-2 text-3xl font-black text-white">
                  {booking.mentorName}
                </h2>
                <p className="mt-2 text-sm text-slate-400">
                  {booking.mentorTimezone}
                </p>

                <div className="mx-auto mt-8 max-w-md rounded-2xl border border-white/10 bg-white/[0.06] p-5">
                  <p className="text-sm font-semibold text-slate-200">
                    {started
                      ? `Hi ${booking.studentName}! Your demo classroom is ready.`
                      : `Welcome ${booking.studentName}! Your mentor will guide you through an introductory coding session.`}
                  </p>
                  <p className="mt-2 text-xs leading-5 text-slate-400">
                    {started
                      ? "For this assessment demo, this screen represents the online classroom."
                      : "Click the button below to enter the demo classroom."}
                  </p>
                </div>

                {!started && (
                  <button
                    onClick={() => setStarted(true)}
                    className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-white px-7 py-4 text-sm font-black text-slate-950 shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-200"
                  >
                    Enter demo classroom
                    <Icon name="arrow" size={17} />
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 border-t border-white/10 bg-slate-950 p-4">
              {started && (
                <>
                  <button className="rounded-xl bg-white/10 px-4 py-2.5 text-xs font-bold text-white">
                    🎤 Mic On
                  </button>
                  <button className="rounded-xl bg-white/10 px-4 py-2.5 text-xs font-bold text-white">
                    🎥 Camera On
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      window.location.href = "/";
                    }}
                    className="rounded-xl bg-red-500/15 px-4 py-2.5 text-xs font-bold text-red-300 transition hover:bg-red-500/25"
                  >
                    Leave demo
                  </button>
                </>
              )}
            </div>
          </section>

          <aside className="space-y-5">
            <div className="rounded-[28px] border border-slate-400 bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                Student
              </p>
              <h2 className="mt-2 text-2xl font-black">{booking.studentName}</h2>
              <p className="mt-1 text-sm text-slate-500">Age {booking.studentAge}</p>

              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
                  <span className="text-xs text-slate-500">Mentor</span>
                  <span className="text-sm font-bold">{booking.mentorName}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
                  <span className="text-xs text-slate-500">Duration</span>
                  <span className="text-sm font-bold">60 minutes</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
                  <span className="text-xs text-slate-500">Status</span>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">Confirmed</span>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-indigo-100 bg-indigo-50 p-6">
              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
                  <Icon name="spark" size={19} />
                </div>
                <div>
                  <p className="text-sm font-bold text-indigo-950">What happens next?</p>
                  <p className="mt-2 text-xs leading-5 text-indigo-800">
                    In a production application, this classroom can be connected to Zoom, Google Meet, or a WebRTC video session.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

function BookingPage() {
  const [parentName, setParentName] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentAge, setStudentAge] = useState("");

  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [date, setDate] = useState("");

  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [selectedSlot, setSelectedSlot] =
    useState<AvailabilitySlot | null>(null);

  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(false);

  const [message, setMessage] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [assignedMentor, setAssignedMentor] = useState<{ name: string; timezone: string } | null>(null);

  const [currentStep, setCurrentStep] = useState(1);

  const [showMentors, setShowMentors] = useState(false);
  const [mentorFilter, setMentorFilter] = useState("All Mentors");

  const [currentTime, setCurrentTime] = useState("");

  const selectedTimezone = useMemo(
    () =>
      timezones.find((item) => item.value === timezone) ||
      timezones[0],
    [timezone]
  );

  const filteredMentors = useMemo(() => {
    if (mentorFilter === "All Mentors") {
      return mentors;
    }

    return mentors.filter((mentor) =>
      mentor.specialties.includes(mentorFilter)
    );
  }, [mentorFilter]);

  useEffect(() => {
    const updateTime = () => {
      const time = new Intl.DateTimeFormat("en-US", {
        timeZone: timezone,
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }).format(new Date());

      setCurrentTime(time);
    };

    updateTime();

    const interval = window.setInterval(updateTime, 30000);

    return () => window.clearInterval(interval);
  }, [timezone]);

  const resetBookingState = () => {
    setSlots([]);
    setSelectedSlot(null);
    setMeetingLink("");
    setAssignedMentor(null);
    setMessage("");
  };

  const fetchSlots = async () => {
    if (!date) {
      setMessage("Please select a preferred date.");
      return;
    }

    setLoading(true);
    setMessage("");
    setMeetingLink("");
    setSelectedSlot(null);

    try {
      const response = await fetch(
        `${API_URL}/api/availability?date=${date}&timezone=${encodeURIComponent(
          timezone
        )}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load available times."
        );
      }

      setSlots(data.slots || []);
      setCurrentStep(2);

      window.scrollTo({
        top: 250,
        behavior: "smooth",
      });
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to load available times."
      );
    } finally {
      setLoading(false);
    }
  };

  const continueFromTime = () => {
    if (!selectedSlot) {
      setMessage("Please select an available time.");
      return;
    }

    setMessage("");
    setCurrentStep(3);

    window.scrollTo({
      top: 250,
      behavior: "smooth",
    });
  };

  const continueFromDetails = () => {
    if (!parentName.trim()) {
      setMessage("Please enter the parent name.");
      return;
    }

    if (!parentEmail.trim()) {
      setMessage("Please enter the parent email.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(parentEmail.trim())) {
      setMessage("Please enter a valid email address.");
      return;
    }

    if (!studentName.trim()) {
      setMessage("Please enter the student's name.");
      return;
    }

    if (!studentAge) {
      setMessage("Please select the student's age.");
      return;
    }

    setMessage("");
    setCurrentStep(4);

    window.scrollTo({
      top: 250,
      behavior: "smooth",
    });
  };

  const bookTrial = async () => {
    if (!selectedSlot) {
      setMessage("Please select an available time.");
      return;
    }

    setBooking(true);
    setMessage("");
    setMeetingLink("");

    try {
      const response = await fetch(
        `${API_URL}/api/bookings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
  parentName,
  parentEmail,
  parentTimezone: timezone,
  studentName,
  studentAge: Number(studentAge),
  startTimeUTC: selectedSlot.startTimeUTC,
  endTimeUTC: selectedSlot.endTimeUTC,
}),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Booking failed.");
      }

      const mentor = data.booking?.mentor;
      const mentorName = mentor?.name || "Your Elevora Mentor";
      const mentorTimezone = mentor?.timezone || timezone;

      const demoBooking: DemoBooking = {
        bookingId: data.booking?.id,
        parentName,
        studentName,
        studentAge: Number(studentAge),
        mentorName,
        mentorTimezone,
        date: formatSelectedDate(),
        localTime: selectedSlot.localTime,
        timezone: `${selectedTimezone.label} (${selectedTimezone.short})`,
      };

      window.localStorage.setItem(
        "elevora-demo-booking",
        JSON.stringify(demoBooking)
      );

      const demoUrl = `${window.location.origin}/?demo=1`;

      setAssignedMentor({
        name: mentorName,
        timezone: mentorTimezone,
      });
      setMessage("Trial class confirmed.");
      setMeetingLink(demoUrl);
      setCurrentStep(4);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to complete your booking."
      );
    } finally {
      setBooking(false);
    }
  };

  const formatSelectedDate = () => {
    if (!date) return "";

    const [year, month, day] = date.split("-");

    const selectedDate = new Date(
      Number(year),
      Number(month) - 1,
      Number(day)
    );

    return selectedDate.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (time: string) => {
    const [hourString, minute] = time.split(":");
    const hour = Number(hourString);

    const suffix = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;

    return `${displayHour}:${minute} ${suffix}`;
  };

  const changeTimezone = (value: string) => {
    setTimezone(value);
    resetBookingState();
    setCurrentStep(1);
  };

  const changeDate = (value: string) => {
    setDate(value);
    resetBookingState();
    setCurrentStep(1);
  };

  return (
    <div className="min-h-screen bg-[#f7f8fc] text-slate-900">

      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-sm font-black text-white shadow-sm">
              E
            </div>

            <div>
              <div className="text-lg font-bold tracking-tight">
                Elevora
              </div>

              <div className="text-[11px] font-medium text-slate-400">
                Personalized learning. Real progress.
              </div>
            </div>
          </div>

          <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-500 md:flex">
            <button
              onClick={() => setShowMentors(true)}
              className="transition hover:text-slate-950"
            >
              Mentors
            </button>

            <span>1:1 Learning</span>
            <span>Free Trial</span>
          </nav>

          <button
            onClick={() => setShowMentors(true)}
            className="rounded-full border border-slate-400 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50"
          >
            Meet our mentors
          </button>

        </div>
      </header>


      {/* HERO */}
      <section className="relative overflow-hidden bg-slate-950">

        <div className="absolute -right-40 -top-48 h-[500px] w-[500px] rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="absolute -bottom-64 left-0 h-[420px] w-[420px] rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-16">

          <div className="max-w-4xl">

            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-semibold text-slate-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Free personalized trial class
            </div>

            <h1 className="text-4xl font-black leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Discover a smarter way
              <span className="block text-slate-400">
                to learn technology.
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
              Book a personalized 1:1 coding trial with an experienced
              mentor. Choose a time that works for you and start your
              learning journey from anywhere.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">

              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2.5 text-sm text-slate-300">
                <Icon name="user" size={15} />
                1:1 mentor session
              </div>

              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2.5 text-sm text-slate-300">
                <Icon name="clock" size={15} />
                60-minute class
              </div>

              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2.5 text-sm text-slate-300">
                <Icon name="check" size={15} />
                100% free
              </div>

            </div>

          </div>

        </div>
      </section>


      {/* MAIN */}
      <main className="mx-auto max-w-7xl px-5 py-8 lg:px-8 lg:py-12">

        {/* PROGRESS */}
        <div className="mb-9 overflow-x-auto pb-2">

          <div className="mx-auto flex min-w-[620px] max-w-4xl items-center">

            {[
              ["1", "Timezone"],
              ["2", "Date & Time"],
              ["3", "Your Details"],
              ["4", "Confirm"],
            ].map(([number, label], index) => {

              const stepNumber = Number(number);
              const active = currentStep >= stepNumber;

              return (
                <div
                  key={number}
                  className="flex flex-1 items-center"
                >

                  <div className="flex items-center gap-3">

                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        active
                          ? "bg-slate-950 text-white shadow-md"
                          : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      {currentStep > stepNumber ? (
                        <Icon name="check" size={16} />
                      ) : (
                        number
                      )}
                    </div>

                    <span
                      className={`whitespace-nowrap text-sm font-semibold ${
                        active
                          ? "text-slate-900"
                          : "text-slate-400"
                      }`}
                    >
                      {label}
                    </span>

                  </div>

                  {index < 3 && (
                    <div
                      className={`mx-4 h-px flex-1 ${
                        currentStep > stepNumber
                          ? "bg-slate-900"
                          : "bg-slate-200"
                      }`}
                    />
                  )}

                </div>
              );
            })}

          </div>
        </div>


        {/* SUCCESS */}
        {meetingLink ? (

          <section className="mx-auto max-w-3xl">

            <div className="overflow-hidden rounded-[28px] border border-emerald-200 bg-white shadow-xl">

              <div className="bg-emerald-50 px-6 py-10 text-center sm:px-10">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg">
                  <Icon name="check" size={30} />
                </div>

                <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
                  Booking confirmed
                </p>

                <h2 className="mt-3 text-3xl font-black tracking-tight text-emerald-950 sm:text-4xl">
                  Your trial class is booked!
                </h2>

                <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-emerald-800">
                  Your personalized trial session has been successfully
                  scheduled.
                </p>

              </div>

              <div className="p-6 sm:p-10">

                <div className="grid gap-4 sm:grid-cols-2">

                  <div className="rounded-2xl bg-slate-50 p-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Date
                    </p>
                    <p className="mt-2 font-bold">
                      {formatSelectedDate()}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Time
                    </p>
                    <p className="mt-2 font-bold">
                      {selectedSlot
                        ? formatTime(selectedSlot.localTime)
                        : ""}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Timezone
                    </p>
                    <p className="mt-2 font-bold">
                      {selectedTimezone.short}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Duration
                    </p>
                    <p className="mt-2 font-bold">
                      60 minutes
                    </p>
                  </div>

                </div>

                {assignedMentor && (
                  <div className="mt-6 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-indigo-500">
                      Your assigned mentor
                    </p>
                    <div className="mt-3 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-lg font-black text-slate-950">
                          {assignedMentor.name}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          Mentor timezone: {assignedMentor.timezone}
                        </p>
                      </div>
                      <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                        Assigned
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-6 rounded-2xl border border-slate-400 p-5">

                  <div className="flex items-center justify-between">

                    <div>
                      <p className="font-bold">
                        {studentName}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Student · Age {studentAge}
                      </p>
                    </div>

                    <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                      Free Trial
                    </div>

                  </div>

                </div>

                <a
                  href={meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-6 py-4 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-800"
                >
                  Try Demo Class
                  <Icon name="arrow" size={17} />
                </a>

                <p className="mt-3 text-center text-xs leading-5 text-slate-400">
                  The demo classroom will open in a new tab.
                </p>

              </div>
            </div>
          </section>

        ) : (

          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">

            {/* LEFT */}
            <section className="rounded-[28px] border border-slate-400 bg-white p-6 shadow-sm sm:p-8">

              {/* STEP 1 */}
              {currentStep === 1 && (

                <div>

                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-500">
                    Step 1 of 4
                  </p>

                  <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
                    Choose your timezone
                  </h2>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                    We'll use your timezone to show accurate local
                    availability for your trial class.
                  </p>


                  {/* TIMEZONE CARD */}
                  <div className="mt-7 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-5">

                    <div className="flex items-center justify-between gap-5">

                      <div className="flex items-center gap-4">

                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
                          <Icon name="globe" size={22} />
                        </div>

                        <div>

                          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-500">
                            Currently selected
                          </p>

                          <h3 className="mt-1 font-bold">
                            {selectedTimezone.label}
                          </h3>

                          <p className="mt-1 text-xs text-slate-500">
                            {selectedTimezone.short} ·{" "}
                            {selectedTimezone.value}
                          </p>

                        </div>

                      </div>

                      <div className="hidden text-right sm:block">

                        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                          Local time
                        </p>

                        <p className="mt-1 text-lg font-black text-slate-900">
                          {currentTime}
                        </p>

                      </div>

                    </div>

                  </div>


                  {/* TIMEZONE */}
                  <div className="mt-7">

                    <label className="mb-2 block text-sm font-bold">
                      Select timezone
                    </label>

                    <select
                      value={timezone}
                      onChange={(event) =>
                        changeTimezone(event.target.value)
                      }
                      className="w-full rounded-2xl border border-slate-400 bg-slate-50 px-4 py-4 text-sm font-medium outline-none transition focus:border-slate-950 focus:bg-white focus:ring-4 focus:ring-slate-100"
                    >
                      {timezones.map((item) => (
                        <option
                          key={item.value}
                          value={item.value}
                        >
                          {item.label} ({item.short})
                        </option>
                      ))}
                    </select>

                  </div>


                  {/* DATE */}
                  <div className="mt-6">

                    <label className="mb-2 block text-sm font-bold">
                      Preferred date
                    </label>

                    <div className="relative">

                      <Icon
                        name="calendar"
                        size={18}
                      />

                      <input
                        type="date"
                        min={getTodayDate()}
                        value={date}
                        onChange={(event) =>
                          changeDate(event.target.value)
                        }
                        className="w-full rounded-2xl border border-slate-400 bg-slate-50 px-4 py-4 text-sm font-medium outline-none transition focus:border-slate-950 focus:bg-white focus:ring-4 focus:ring-slate-100"
                      />

                    </div>

                  </div>


                  <button
                    onClick={fetchSlots}
                    disabled={loading}
                    className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-6 py-4 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading
                      ? "Finding available mentors..."
                      : "Find available times"}

                    {!loading && (
                      <Icon name="arrow" size={17} />
                    )}
                  </button>


                  {message && (
                    <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-900">
                      {message}
                    </div>
                  )}

                </div>
              )}


              {/* STEP 2 */}
              {currentStep === 2 && (

                <div>

                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-500">
                    Step 2 of 4
                  </p>

                  <div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row">

                    <div>

                      <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
                        Choose a convenient time
                      </h2>

                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        Select an available session that works for you.
                      </p>

                    </div>

                    {slots.length > 0 && (
                      <div className="h-fit rounded-full bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700">
                        {slots.length} sessions available
                      </div>
                    )}

                  </div>


                  {slots.length > 0 ? (

                    <div className="mt-7">

                      <div className="flex flex-col gap-4 rounded-2xl border border-slate-400 bg-slate-50 p-5 sm:flex-row sm:items-center sm:justify-between">

                        <div className="flex items-center gap-3">

                          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-slate-700 shadow-sm">
                            <Icon name="calendar" size={20} />
                          </div>

                          <div>

                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              Selected date
                            </p>

                            <p className="mt-1 font-bold">
                              {formatSelectedDate()}
                            </p>

                          </div>

                        </div>

                        <div className="text-left sm:text-right">

                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Timezone
                          </p>

                          <p className="mt-1 font-bold">
                            {selectedTimezone.short}
                          </p>

                        </div>

                      </div>


                      <div className="mt-7">

                        <div className="mb-3 flex items-center justify-between">

                          <p className="text-sm font-bold">
                            Available sessions
                          </p>

                          <p className="text-xs text-slate-400">
                            60-minute classes
                          </p>

                        </div>


                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">

                          {slots.map((slot) => {

                            const isSelected =
                              selectedSlot?.startTimeUTC ===
                              slot.startTimeUTC;

                            return (
                              <button
                                key={slot.startTimeUTC}
                                onClick={() => {
                                  setSelectedSlot(slot);
                                  setMessage("");
                                }}
                                className={`group rounded-2xl border p-4 text-left transition ${
                                  isSelected
                                    ? "border-slate-950 bg-slate-950 text-white shadow-xl"
                                    : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-slate-400 hover:shadow-md"
                                }`}
                              >

                                <div className="flex items-center justify-between">

                                  <span className="text-lg font-black">
                                    {formatTime(slot.localTime)}
                                  </span>

                                  {isSelected && (
                                    <span className="text-emerald-400">
                                      <Icon
                                        name="check"
                                        size={17}
                                      />
                                    </span>
                                  )}

                                </div>

                                <div className="mt-3 flex items-center gap-1.5">

                                  <Icon
                                    name="users"
                                    size={13}
                                  />

                                  <span
                                    className={`text-xs font-semibold ${
                                      isSelected
                                        ? "text-emerald-400"
                                        : "text-emerald-600"
                                    }`}
                                  >
                                    {slot.availableMentors} mentors
                                    available
                                  </span>

                                </div>

                              </button>
                            );
                          })}

                        </div>

                      </div>


                      {selectedSlot && (

                        <div className="mt-7 rounded-2xl border border-slate-400 bg-white p-5 shadow-sm">

                          <div className="flex items-start justify-between gap-4">

                            <div>

                              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-500">
                                Selected session
                              </p>

                              <h3 className="mt-2 text-xl font-black">
                                {formatTime(selectedSlot.localTime)}
                              </h3>

                              <p className="mt-1 text-sm text-slate-500">
                                {formatSelectedDate()}
                              </p>

                            </div>

                            <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                              Free
                            </div>

                          </div>

                          <div className="mt-5 grid gap-3 sm:grid-cols-3">

                            <div className="rounded-xl bg-slate-50 p-4">
                              <p className="text-xs text-slate-400">
                                Timezone
                              </p>
                              <p className="mt-1 text-sm font-bold">
                                {selectedTimezone.short}
                              </p>
                            </div>

                            <div className="rounded-xl bg-slate-50 p-4">
                              <p className="text-xs text-slate-400">
                                Duration
                              </p>
                              <p className="mt-1 text-sm font-bold">
                                60 minutes
                              </p>
                            </div>

                            <div className="rounded-xl bg-slate-50 p-4">
                              <p className="text-xs text-slate-400">
                                Mentors
                              </p>
                              <p className="mt-1 text-sm font-bold">
                                {selectedSlot.availableMentors}
                              </p>
                            </div>

                          </div>

                          <button
                            onClick={continueFromTime}
                            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-4 text-sm font-bold text-white transition hover:bg-slate-800"
                          >
                            Continue to details
                            <Icon name="arrow" size={16} />
                          </button>

                        </div>
                      )}

                    </div>

                  ) : (

                    <div className="mt-8 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">

                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-500 shadow-sm">
                        <Icon name="calendar" size={24} />
                      </div>

                      <h3 className="mt-5 font-bold">
                        No sessions available
                      </h3>

                      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                        There are no available mentors for this date.
                        Try selecting another date or timezone.
                      </p>

                      <button
                        onClick={() => setCurrentStep(1)}
                        className="mt-5 rounded-xl border border-slate-400 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
                      >
                        Change date
                      </button>

                    </div>
                  )}

                  {message && (
                    <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-900">
                      {message}
                    </div>
                  )}

                </div>
              )}


              {/* STEP 3 */}
              {currentStep === 3 && (

                <div>

                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-500">
                    Step 3 of 4
                  </p>

                  <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
                    Tell us about the student
                  </h2>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                    These details help us prepare a better trial
                    experience.
                  </p>


                  {selectedSlot && (

                    <div className="mt-7 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-5">

                      <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
                          <Icon name="clock" size={20} />
                        </div>

                        <div>

                          <p className="text-xs font-bold uppercase tracking-wider text-indigo-500">
                            Selected session
                          </p>

                          <p className="mt-1 font-bold">
                            {formatTime(selectedSlot.localTime)}
                            {" · "}
                            {selectedTimezone.short}
                          </p>

                        </div>

                        <button
                          onClick={() => setCurrentStep(2)}
                          className="ml-auto text-xs font-bold text-indigo-600 hover:text-indigo-900"
                        >
                          Change
                        </button>

                      </div>

                    </div>
                  )}


                  <div className="mt-7 grid gap-5 sm:grid-cols-2">

                    <div>
                      <label className="mb-2 block text-sm font-bold">
                        Parent name
                      </label>

                      <input
                        value={parentName}
                        onChange={(event) =>
                          setParentName(event.target.value)
                        }
                        placeholder="e.g. Your Name"
                        className="w-full rounded-2xl border border-slate-400 bg-slate-50 px-4 py-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-950 focus:bg-white focus:ring-4 focus:ring-slate-100"
                      />
                    </div>


                    <div>
                      <label className="mb-2 block text-sm font-bold">
                        Parent email
                      </label>

                      <input
                        type="email"
                        value={parentEmail}
                        onChange={(event) =>
                          setParentEmail(event.target.value)
                        }
                        placeholder="you@example.com"
                        className="w-full rounded-2xl border border-slate-400 bg-slate-50 px-4 py-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-950 focus:bg-white focus:ring-4 focus:ring-slate-100"
                      />
                    </div>


                    <div>
                      <label className="mb-2 block text-sm font-bold">
                        Student name
                      </label>

                      <input
                        value={studentName}
                        onChange={(event) =>
                          setStudentName(event.target.value)
                        }
                        placeholder="e.g. Student Name"
                        className="w-full rounded-2xl border border-slate-400 bg-slate-50 px-4 py-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-950 focus:bg-white focus:ring-4 focus:ring-slate-100"
                      />
                    </div>


                    <div>
                      <label className="mb-2 block text-sm font-bold">
                        Student age
                      </label>

                      <select
                        value={studentAge}
                        onChange={(event) =>
                          setStudentAge(event.target.value)
                        }
                        className="w-full rounded-2xl border border-slate-400 bg-slate-50 px-4 py-4 text-sm font-medium outline-none transition focus:border-slate-950 focus:bg-white focus:ring-4 focus:ring-slate-100"
                      >
                        <option value="">
                          Select age
                        </option>

                        {Array.from(
                          { length: 12 },
                          (_, index) => index + 6
                        ).map((age) => (
                          <option key={age} value={age}>
                            {age} years
                          </option>
                        ))}
                      </select>
                    </div>

                  </div>


                  <div className="mt-6 rounded-2xl border border-slate-400 bg-slate-50 p-5">

                    <div className="flex gap-3">

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-slate-600">
                        <Icon name="shield" size={18} />
                      </div>

                      <div>

                        <p className="text-sm font-bold">
                          Your information stays private
                        </p>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          Your details are used only to create and
                          manage your trial booking.
                        </p>

                      </div>

                    </div>

                  </div>


                  <button
                    onClick={continueFromDetails}
                    className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-6 py-4 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-800"
                  >
                    Review booking
                    <Icon name="arrow" size={17} />
                  </button>


                  {message && (
                    <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-900">
                      {message}
                    </div>
                  )}

                </div>
              )}

              {currentStep === 4 && !meetingLink && (

                <div>

                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-500">
                    Step 4 of 4
                  </p>

                  <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
                    Review and confirm
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Review your details before confirming your free
                    trial session.
                  </p>


                  <div className="mt-7 overflow-hidden rounded-3xl border border-slate-400">

                    <div className="bg-slate-950 p-6 text-white">

                      <div className="flex items-start justify-between">

                        <div>

                          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            Your trial session
                          </p>

                          <h3 className="mt-2 text-2xl font-black">
                            {selectedSlot
                              ? formatTime(selectedSlot.localTime)
                              : ""}
                          </h3>

                          <p className="mt-1 text-sm text-slate-400">
                            {formatSelectedDate()}
                          </p>

                        </div>

                        <div className="rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-400">
                          FREE
                        </div>

                      </div>

                    </div>


                    <div className="space-y-5 p-6">

                      <div className="grid gap-5 sm:grid-cols-2">

                        <div>

                          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            Parent
                          </p>

                          <p className="mt-1 font-bold">
                            {parentName}
                          </p>

                          <p className="mt-1 text-sm text-slate-500">
                            {parentEmail}
                          </p>

                        </div>


                        <div>

                          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            Student
                          </p>

                          <p className="mt-1 font-bold">
                            {studentName}
                          </p>

                          <p className="mt-1 text-sm text-slate-500">
                            Age {studentAge}
                          </p>

                        </div>

                      </div>


                      <div className="h-px bg-slate-100" />


                      <div className="grid gap-4 sm:grid-cols-3">

                        <div>
                          <p className="text-xs text-slate-400">
                            Timezone
                          </p>
                          <p className="mt-1 text-sm font-bold">
                            {selectedTimezone.short}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-slate-400">
                            Duration
                          </p>
                          <p className="mt-1 text-sm font-bold">
                            60 minutes
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-slate-400">
                            Available mentors
                          </p>
                          <p className="mt-1 text-sm font-bold">
                            {selectedSlot?.availableMentors || 0}
                          </p>
                        </div>

                      </div>


                      <div className="rounded-2xl bg-emerald-50 p-4">

                        <div className="flex gap-3">

                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-emerald-600">
                            <Icon name="check" size={16} />
                          </div>

                          <div>

                            <p className="text-sm font-bold text-emerald-900">
                              Mentor matching included
                            </p>

                            <p className="mt-1 text-xs leading-5 text-emerald-700">
                              An available mentor will be assigned
                              automatically when your booking is created.
                            </p>

                          </div>

                        </div>

                      </div>


                      <button
                        onClick={bookTrial}
                        disabled={booking}
                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-6 py-4 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {booking
                          ? "Confirming your trial..."
                          : "Confirm my free trial"}

                        {!booking && (
                          <Icon name="arrow" size={17} />
                        )}
                      </button>


                      <button
                        onClick={() => setCurrentStep(3)}
                        disabled={booking}
                        className="w-full rounded-2xl border border-slate-400 bg-white px-6 py-3.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                      >
                        ← Edit details
                      </button>

                    </div>

                  </div>


                  {message && (
                    <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-900">
                      {message}
                    </div>
                  )}

                </div>
              )}

            </section>


            {/* RIGHT SIDE */}
            <aside className="space-y-5">

              <div className="rounded-[28px] border border-slate-400 bg-white p-6 shadow-sm">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                      Your trial
                    </p>

                    <h3 className="mt-2 text-xl font-black">
                      What to expect
                    </h3>

                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                    <Icon name="spark" size={21} />
                  </div>

                </div>


                <div className="mt-6 space-y-5">

                  <div className="flex gap-4">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                      <Icon name="user" size={19} />
                    </div>

                    <div>

                      <p className="text-sm font-bold">
                        Personalized mentor
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        Get matched with an available mentor based on
                        your selected time.
                      </p>

                    </div>

                  </div>


                  <div className="flex gap-4">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                      <Icon name="code" size={19} />
                    </div>

                    <div>

                      <p className="text-sm font-bold">
                        Interactive session
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        Explore coding concepts through a personalized
                        learning experience.
                      </p>

                    </div>

                  </div>


                  <div className="flex gap-4">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                      <Icon name="globe" size={19} />
                    </div>

                    <div>

                      <p className="text-sm font-bold">
                        Flexible scheduling
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        Choose a time that works naturally with your
                        local timezone.
                      </p>

                    </div>

                  </div>

                </div>

              </div>


              <div className="grid grid-cols-2 gap-4">

                <div className="rounded-2xl border border-slate-400 bg-white p-5">

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <Icon name="users" size={18} />
                  </div>

                  <p className="mt-4 text-2xl font-black">
                    10
                  </p>

                  <p className="mt-1 text-xs font-medium text-slate-500">
                    Expert mentors
                  </p>

                </div>

                <div className="rounded-2xl border border-slate-400 bg-white p-5">

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <Icon name="clock" size={18} />
                  </div>

                  <p className="mt-4 text-2xl font-black">
                    60
                  </p>

                  <p className="mt-1 text-xs font-medium text-slate-500">
                    Minutes
                  </p>

                </div>

              </div>


              <button
                onClick={() => setShowMentors(true)}
                className="group w-full rounded-[28px] bg-slate-950 p-6 text-left text-white shadow-lg transition hover:-translate-y-0.5"
              >

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                      Explore
                    </p>

                    <h3 className="mt-2 text-xl font-black">
                      Meet our mentors
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      Explore the educators available across our mentor
                      network.
                    </p>

                  </div>

                  <Icon name="arrow" size={22} />

                </div>

              </button>


              <div className="rounded-[28px] border border-slate-400 bg-white p-6">

                <div className="flex gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <Icon name="shield" size={19} />
                  </div>

                  <div>

                    <p className="text-sm font-bold">
                      Simple & secure
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Your booking information is securely processed
                      for your trial session.
                    </p>

                  </div>

                </div>

              </div>

            </aside>

          </div>
        )}


        {/* BENEFITS */}
        {!meetingLink && (
          <section className="mt-10 grid gap-4 sm:grid-cols-3">

            <div className="rounded-2xl border border-slate-400 bg-white p-5">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Icon name="globe" size={19} />
              </div>

              <h3 className="mt-4 font-bold">
                Global scheduling
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                Times are automatically calculated according to your
                selected timezone.
              </p>

            </div>


            <div className="rounded-2xl border border-slate-400 bg-white p-5">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Icon name="users" size={19} />
              </div>

              <h3 className="mt-4 font-bold">
                Mentor matching
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                Our availability engine matches you with an eligible
                mentor.
              </p>

            </div>


            <div className="rounded-2xl border border-slate-400 bg-white p-5">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Icon name="clock" size={19} />
              </div>

              <h3 className="mt-4 font-bold">
                Quick booking
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                Choose your time, enter your details and confirm your
                free session.
              </p>

            </div>

          </section>
        )}

      </main>


      {/* MENTOR DIRECTORY */}
      {showMentors && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">

          <div className="flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-[28px] bg-white shadow-2xl">

            <div className="border-b border-slate-200 p-6 sm:p-8">

              <div className="flex items-start justify-between gap-6">

                <div>

                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-500">
                    Mentor network
                  </p>

                  <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
                    Meet our mentors
                  </h2>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                    Explore educators available for personalized
                    learning sessions.
                  </p>

                </div>

                <button
                  onClick={() => setShowMentors(false)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200"
                >
                  <Icon name="close" size={18} />
                </button>

              </div>


              <div className="mt-6 flex gap-2 overflow-x-auto pb-1">

                {mentorFilters.map((filter) => (

                  <button
                    key={filter}
                    onClick={() => setMentorFilter(filter)}
                    className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold transition ${
                      mentorFilter === filter
                        ? "bg-slate-950 text-white"
                        : "border border-slate-400 bg-white text-slate-500 hover:border-slate-400 hover:text-slate-900"
                    }`}
                  >
                    {filter}
                  </button>

                ))}

              </div>

            </div>


            <div className="overflow-y-auto p-6 sm:p-8">

              <div className="grid gap-4 md:grid-cols-2">

                {filteredMentors.map((mentor) => (

                  <div
                    key={mentor.name}
                    className="rounded-2xl border border-slate-400 bg-white p-5 transition hover:border-slate-300 hover:shadow-md"
                  >

                    <div className="flex items-start gap-4">

                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-slate-100">
                        <img
                          src={mentor.image}
                          alt={mentor.name}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="min-w-0 flex-1">

                        <div className="flex items-start justify-between gap-3">

                          <div>

                            <h3 className="font-black text-slate-950">
                              {mentor.name}
                            </h3>

                            <p className="mt-0.5 text-xs font-semibold text-indigo-600">
                              {mentor.role}
                            </p>

                          </div>

                          <span className="flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Available
                          </span>

                        </div>

                        <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
                          <Icon name="globe" size={13} />
                          {mentor.timezone}
                        </p>

                      </div>

                    </div>


                    <div className="mt-5 grid grid-cols-2 gap-3">

                      <div className="rounded-xl bg-slate-50 p-3">

                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Experience
                        </p>

                        <p className="mt-1 text-xs font-semibold text-slate-700">
                          {mentor.experience}
                        </p>

                      </div>

                      <div className="rounded-xl bg-slate-50 p-3">

                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Age focus
                        </p>

                        <p className="mt-1 text-xs font-semibold text-slate-700">
                          {mentor.ageFocus}
                        </p>

                      </div>

                    </div>


                    <div className="mt-4 space-y-2">

                      <p className="text-xs text-slate-500">
                        <span className="font-bold text-slate-700">
                          Education:
                        </span>{" "}
                        {mentor.education}
                      </p>

                      <p className="text-xs text-slate-500">
                        <span className="font-bold text-slate-700">
                          Languages:
                        </span>{" "}
                        {mentor.languages}
                      </p>

                    </div>


                    <div className="mt-4 flex flex-wrap gap-2">

                      {mentor.specialties.map((specialty) => (

                        <span
                          key={specialty}
                          className="rounded-full border border-slate-400 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-600"
                        >
                          {specialty}
                        </span>

                      ))}

                    </div>

                  </div>

                ))}

              </div>

            </div>


            <div className="border-t border-slate-200 bg-slate-50 px-6 py-4 sm:px-8">

              <div className="flex items-center justify-between gap-4">

                <p className="text-xs text-slate-500">
                  {filteredMentors.length} mentor
                  {filteredMentors.length !== 1 ? "s" : ""} shown
                </p>

                <button
                  onClick={() => setShowMentors(false)}
                  className="rounded-xl bg-slate-950 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800"
                >
                  Close directory
                </button>

              </div>

            </div>

          </div>

        </div>
      )}


      {/* FOOTER */}
        <footer className="border-t border-slate-800 bg-[#020617]">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-10 text-sm sm:flex-row sm:items-center sm:justify-between lg:px-8">
            
            {/* Brand */}
            <div>
              <p className="text-lg font-bold text-white">
                Elevora
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Personalized learning. Real progress.
              </p>
            </div>

            {/* Copyright + Portfolio */}
            <div className="flex flex-col items-start gap-2 sm:items-end">
              <p className="text-xs text-slate-500">
                © 2026 Elevora · Assessment project for CodeYoung
              </p>

              <p className="text-xs font-semibold text-slate-300">
                Developed by{" "}
                <span className="text-white">Chethan C. Malli</span>
              </p>

              <a
                href="https://chethumalli-portfolio.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:border-indigo-500 hover:bg-indigo-600 hover:text-white"
              >
                View Portfolio →
              </a>
            </div>

          </div>
        </footer>

    </div>
  );
}

function App() {
  const demoMode = new URLSearchParams(window.location.search).get("demo") === "1";

  if (demoMode) {
    return <DemoClassPage />;
  }

  return <BookingPage />;
}

export default App;