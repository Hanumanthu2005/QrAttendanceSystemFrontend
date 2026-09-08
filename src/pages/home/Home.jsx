import React from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowRight,
    BarChart3,
    CalendarCheck,
    CheckCircle2,
    GraduationCap,
    LockKeyhole,
    QrCode,
    ScanLine,
    ShieldCheck,
    Users
} from "lucide-react";
import "./Home.css";

export default function Home() {

    const navigate = useNavigate();

    return (
        <div className="home-page">

            {/* ================= NAVBAR ================= */}

            <nav className="home-navbar">

                <div
                    className="home-logo"
                    onClick={() => navigate("/")}
                >
                    <div className="home-logo-icon">
                        <QrCode size={24} />
                    </div>

                    <div>
                        <strong>QR Attendance</strong>
                        <span>Management System</span>
                    </div>
                </div>


                <div className="home-nav-links">

                    <a href="#features">
                        Features
                    </a>

                    <a href="#how-it-works">
                        How It Works
                    </a>

                </div>


                <button
                    className="home-login-button"
                    onClick={() => navigate("/login")}
                >
                    Login
                    <ArrowRight size={17} />
                </button>

            </nav>


            {/* ================= HERO ================= */}

            <main>

                <section className="home-hero">

                    <div className="home-hero-content">

                        <div className="home-badge">
                            <QrCode size={15} />
                            Smart QR-Based Attendance
                        </div>

                        <h1>
                            Attendance made
                            <span> simple, fast & secure.</span>
                        </h1>

                        <p>
                            A modern attendance management system that uses
                            QR technology to make classroom attendance faster,
                            more accurate, and easier to manage.
                        </p>


                        <div className="home-hero-actions">

                            <button
                                className="home-primary-button"
                                onClick={() => navigate("/login")}
                            >
                                Get Started
                                <ArrowRight size={18} />
                            </button>

                            <a
                                className="home-secondary-button"
                                href="#how-it-works"
                            >
                                Learn How It Works
                            </a>

                        </div>


                        <div className="home-hero-points">

                            <div>
                                <CheckCircle2 size={17} />
                                Quick attendance
                            </div>

                            <div>
                                <CheckCircle2 size={17} />
                                Secure access
                            </div>

                            <div>
                                <CheckCircle2 size={17} />
                                Easy reporting
                            </div>

                        </div>

                    </div>


                    {/* Hero Visual */}

                    <div className="home-hero-visual">

                        <div className="home-qr-card">

                            <div className="home-qr-header">

                                <div>
                                    <span>Attendance Session</span>
                                    <strong>CS - 2026</strong>
                                </div>

                                <div className="home-live-badge">
                                    <span></span>
                                    LIVE
                                </div>

                            </div>


                            <div className="home-qr-container">

                                <div className="home-qr-pattern">

                                    <QrCode size={185} strokeWidth={1.5} />

                                </div>

                            </div>


                            <p className="home-scan-text">
                                Scan QR code to mark attendance
                            </p>


                            <div className="home-session-info">

                                <div>
                                    <span>Faculty</span>
                                    <strong>Faculty Member</strong>
                                </div>

                                <div>
                                    <span>Status</span>
                                    <strong className="home-open-status">
                                        Session Open
                                    </strong>
                                </div>

                            </div>

                        </div>


                        <div className="home-floating-card home-floating-one">

                            <div className="home-floating-icon">
                                <ScanLine size={18} />
                            </div>

                            <div>
                                <strong>QR Scan</strong>
                                <span>Attendance marked</span>
                            </div>

                        </div>


                        <div className="home-floating-card home-floating-two">

                            <div className="home-floating-icon">
                                <BarChart3 size={18} />
                            </div>

                            <div>
                                <strong>Real-time</strong>
                                <span>Attendance tracking</span>
                            </div>

                        </div>

                    </div>

                </section>


                {/* ================= FEATURES ================= */}

                <section
                    id="features"
                    className="home-features-section"
                >

                    <div className="home-section-heading">

                        <span>POWERFUL FEATURES</span>

                        <h2>
                            Everything you need to manage attendance
                        </h2>

                        <p>
                            Designed to simplify attendance management for
                            administrators, faculty, and students.
                        </p>

                    </div>


                    <div className="home-features-grid">

                        <FeatureCard
                            icon={<QrCode size={24} />}
                            title="QR-Based Attendance"
                            description="Faculty can create attendance sessions and students can mark their attendance by simply scanning a QR code."
                        />

                        <FeatureCard
                            icon={<BarChart3 size={24} />}
                            title="Attendance Tracking"
                            description="Track attendance records and monitor student participation from a centralized system."
                        />

                        <FeatureCard
                            icon={<ShieldCheck size={24} />}
                            title="Role-Based Access"
                            description="Separate dashboards and permissions for administrators, faculty members, and students."
                        />

                        <FeatureCard
                            icon={<CalendarCheck size={24} />}
                            title="Session Management"
                            description="Create, monitor, and close attendance sessions while keeping session records organized."
                        />

                        <FeatureCard
                            icon={<GraduationCap size={24} />}
                            title="Student Management"
                            description="Manage student information, faculty assignments, and attendance history efficiently."
                        />

                        <FeatureCard
                            icon={<Users size={24} />}
                            title="Centralized Reports"
                            description="View attendance information and summaries to understand attendance patterns easily."
                        />

                    </div>

                </section>


                {/* ================= HOW IT WORKS ================= */}

                <section
                    id="how-it-works"
                    className="home-how-section"
                >

                    <div className="home-section-heading">

                        <span>HOW IT WORKS</span>

                        <h2>
                            Attendance in three simple steps
                        </h2>

                        <p>
                            The system eliminates manual attendance and
                            makes the process quick for both faculty and
                            students.
                        </p>

                    </div>


                    <div className="home-steps">

                        <Step
                            number="01"
                            icon={<CalendarCheck size={25} />}
                            title="Create a Session"
                            description="Faculty creates an attendance session for the class."
                        />

                        <Step
                            number="02"
                            icon={<ScanLine size={25} />}
                            title="Scan the QR Code"
                            description="Students scan the displayed QR code using the attendance system."
                        />

                        <Step
                            number="03"
                            icon={<CheckCircle2 size={25} />}
                            title="Attendance Recorded"
                            description="The system verifies the student and records the attendance."
                        />

                    </div>

                </section>


                {/* ================= ROLES ================= */}

                <section className="home-roles-section">

                    <div className="home-role-content">

                        <span>BUILT FOR EVERYONE</span>

                        <h2>
                            One system.
                            <br />
                            Three powerful roles.
                        </h2>

                        <p>
                            Every user gets the tools and permissions they
                            need without unnecessary complexity.
                        </p>

                    </div>


                    <div className="home-role-cards">

                        <RoleCard
                            icon={<LockKeyhole size={23} />}
                            title="Administrator"
                            description="Manage students, faculty, sessions, and attendance records."
                        />

                        <RoleCard
                            icon={<Users size={23} />}
                            title="Faculty"
                            description="Create attendance sessions and monitor student attendance."
                        />

                        <RoleCard
                            icon={<GraduationCap size={23} />}
                            title="Student"
                            description="Scan QR codes and view personal attendance records."
                        />

                    </div>

                </section>


                {/* ================= CTA ================= */}

                <section className="home-cta">

                    <div>

                        <h2>
                            Ready to simplify attendance?
                        </h2>

                        <p>
                            Sign in to access your QR Attendance dashboard.
                        </p>

                    </div>

                    <button
                        onClick={() => navigate("/login")}
                    >
                        Login to Dashboard
                        <ArrowRight size={18} />
                    </button>

                </section>

            </main>


            {/* ================= FOOTER ================= */}

            <footer className="home-footer">

                <div className="home-footer-brand">

                    <div className="home-logo-icon">
                        <QrCode size={21} />
                    </div>

                    <div>
                        <strong>QR Attendance</strong>
                        <span>Management System</span>
                    </div>

                </div>

                <p>
                    QR-based attendance management system.
                </p>

                <span className="home-copyright">
                    © 2026 QR Attendance System
                </span>

            </footer>

        </div>
    );
}


/* ================= FEATURE CARD ================= */

function FeatureCard({ icon, title, description }) {

    return (
        <div className="home-feature-card">

            <div className="home-feature-icon">
                {icon}
            </div>

            <h3>{title}</h3>

            <p>{description}</p>

        </div>
    );
}


/* ================= STEP ================= */

function Step({ number, icon, title, description }) {

    return (
        <div className="home-step">

            <div className="home-step-number">
                {number}
            </div>

            <div className="home-step-icon">
                {icon}
            </div>

            <h3>{title}</h3>

            <p>{description}</p>

        </div>
    );
}


/* ================= ROLE CARD ================= */

function RoleCard({ icon, title, description }) {

    return (
        <div className="home-role-card">

            <div className="home-role-icon">
                {icon}
            </div>

            <div>
                <h3>{title}</h3>
                <p>{description}</p>
            </div>

        </div>
    );
}