import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    GraduationCap,
    ClipboardCheck,
    CalendarDays,
    BarChart3,
    QrCode,
    LogOut
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

export default function Layout() {

    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
    };

    const role = user?.role?.toUpperCase();

    const navigation = {
        ADMIN: [
            {
                label: "Dashboard",
                path: "/admin/dashboard",
                icon: LayoutDashboard
            },
            {
                label: "Students",
                path: "/admin/student",
                icon: GraduationCap
            },
            {
                label: "Faculty",
                path: "/admin/faculty",
                icon: Users
            },
            {
                label: "Attendance",
                path: "/admin/attendance",
                icon: ClipboardCheck
            },
            {
                label: "Sessions",
                path: "/admin/sessions",
                icon: CalendarDays
            }
        ],

        FACULTY: [
            {
                label: "Dashboard",
                path: "/faculty/dashboard",
                icon: LayoutDashboard
            },
            {
                label: "Session",
                path: "/faculty/session",
                icon: CalendarDays
            },
            {
                label: "Scan QR",
                path: "/faculty/scan",
                icon: QrCode
            },
            {
                label: "Attendance",
                path: "/faculty/attendance",
                icon: ClipboardCheck
            },
            {
                label: "Reports",
                path: "/faculty/reports",
                icon: BarChart3
            }
        ],

        STUDENT: [
            {
                label: "Dashboard",
                path: "/student/dashboard",
                icon: LayoutDashboard
            },
            {
                label: "My QR",
                path: "/student/qr",
                icon: QrCode
            },
            {
                label: "Attendance",
                path: "/student/attendance",
                icon: ClipboardCheck
            },
            {
                label: "Summary",
                path: "/student/summary",
                icon: BarChart3
            }
        ]
    };

    const links = navigation[role] || [];

    return (
        <div className="app-layout">

            <aside className="sidebar">

                <div className="sidebar-logo">
                    <QrCode size={28} />
                    <span>QR Attendance</span>
                </div>

                <nav className="sidebar-nav">

                    {links.map((item) => {

                        const Icon = item.icon;

                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    isActive
                                        ? "nav-link active"
                                        : "nav-link"
                                }
                            >
                                <Icon size={19} />
                                <span>{item.label}</span>
                            </NavLink>
                        );

                    })}

                </nav>

                <div className="sidebar-bottom">

                    <div className="user-info">

                        <div className="user-avatar">
                            {user?.name?.charAt(0)?.toUpperCase()}
                        </div>

                        <div>
                            <strong>{user?.name}</strong>
                            <span>{role}</span>
                        </div>

                    </div>

                    <button
                        className="logout-button"
                        onClick={handleLogout}
                    >
                        <LogOut size={18} />
                        Logout
                    </button>

                </div>

            </aside>

            <main className="main-content">

                <header className="topbar">

                    <div>
                        <span className="topbar-role">
                            {role}
                        </span>
                    </div>

                    <div className="topbar-user">
                        {user?.email}
                    </div>

                </header>

                <section className="page-content">
                    <Outlet />
                </section>

            </main>

        </div>
    );
}