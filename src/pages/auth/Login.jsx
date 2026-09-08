import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Mail, Lock, Eye, EyeOff, QrCode, ShieldCheck } from "lucide-react";
import "./Login.css";

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setLoading(true);
        setError("");

        try {
            const user = await login({
                email,
                password
            });

            const role = user.role.toLowerCase();

            navigate(`/${role}/dashboard`);

        } catch (error) {
            console.error(error);

            if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else {
                setError("Invalid email or password");
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">

            <div className="login-container">

                {/* Left Section */}
                <div className="login-left">

                    <div className="login-brand">

                        <div className="login-brand-icon">
                            <QrCode size={26} />
                        </div>

                        <div>
                            <h2>QR Attendance</h2>
                            <span>Attendance Management System</span>
                        </div>

                    </div>

                    <div className="login-welcome">

                        <h1>
                            Smart Attendance.
                            <br />
                            Simple & Secure.
                        </h1>

                        <p>
                            Manage student attendance efficiently using
                            QR-based technology. Track attendance,
                            sessions, and records from one centralized
                            system.
                        </p>

                    </div>

                    <div className="login-features">

                        <div className="login-feature">

                            <div className="login-feature-icon">
                                <QrCode size={18} />
                            </div>

                            <span>
                                Fast QR-based attendance
                            </span>

                        </div>

                        <div className="login-feature">

                            <div className="login-feature-icon">
                                <ShieldCheck size={18} />
                            </div>

                            <span>
                                Secure role-based access
                            </span>

                        </div>

                    </div>

                </div>


                {/* Right Section */}
                <div className="login-right">

                    <div className="login-form-container">

                        <div className="login-form-header">

                            <h2>Welcome Back</h2>

                            <p>
                                Sign in to continue to your account
                            </p>

                        </div>


                        {error && (
                            <div className="login-error">
                                {error}
                            </div>
                        )}


                        <form
                            className="login-form"
                            onSubmit={handleSubmit}
                        >

                            {/* Email */}
                            <div className="login-form-group">

                                <label htmlFor="email">
                                    Email Address
                                </label>

                                <div className="login-input-wrapper">

                                    <Mail
                                        size={18}
                                        className="login-input-icon"
                                    />

                                    <input
                                        id="email"
                                        className="login-input"
                                        type="email"
                                        value={email}
                                        onChange={(event) =>
                                            setEmail(event.target.value)
                                        }
                                        placeholder="Enter your email"
                                        required
                                    />

                                </div>

                            </div>


                            {/* Password */}
                            <div className="login-form-group">

                                <label htmlFor="password">
                                    Password
                                </label>

                                <div className="login-input-wrapper">

                                    <Lock
                                        size={18}
                                        className="login-input-icon"
                                    />

                                    <input
                                        id="password"
                                        className="login-input"
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        value={password}
                                        onChange={(event) =>
                                            setPassword(event.target.value)
                                        }
                                        placeholder="Enter your password"
                                        required
                                    />

                                    <button
                                        type="button"
                                        className="login-password-toggle"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >
                                        {showPassword ? (
                                            <EyeOff size={18} />
                                        ) : (
                                            <Eye size={18} />
                                        )}
                                    </button>

                                </div>

                            </div>


                            {/* Login Button */}
                            <button
                                type="submit"
                                className="login-button"
                                disabled={loading}
                            >

                                {loading ? (
                                    <>
                                        <span className="login-spinner"></span>
                                        Logging in...
                                    </>
                                ) : (
                                    "Login"
                                )}

                            </button>

                        </form>


                        <div className="login-footer">

                            <p>
                                QR Attendance Management System
                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}