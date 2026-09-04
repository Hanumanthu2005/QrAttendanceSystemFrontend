import React, { useEffect, useState } from "react";
import {
    ArrowLeft,
    Download,
    QrCode,
    RefreshCw
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { getStudentQr } from "../../services/studentService";

export default function StudentQR() {

    const navigate = useNavigate();

    const [qrUrl, setQrUrl] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadQr = async () => {

        try {

            setLoading(true);
            setError("");

            const blob = await getStudentQr();

            const url = URL.createObjectURL(blob);

            setQrUrl(url);

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to load QR code"
            );

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {

        loadQr();

        return () => {
            if (qrUrl) {
                URL.revokeObjectURL(qrUrl);
            }
        };

    }, []);

    const downloadQr = () => {

        if (!qrUrl) {
            return;
        }

        const link = document.createElement("a");

        link.href = qrUrl;
        link.download = "student-attendance-qr.png";

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);
    };

    if (loading) {
        return (
            <div className="loading-page">
                <p>Loading your QR code...</p>
            </div>
        );
    }

    return (
        <div>

            {/* ================= HEADER ================= */}

            <div className="page-header">

                <div>

                    <button
                        className="back-button"
                        onClick={() =>
                            navigate("/student/dashboard")
                        }
                    >
                        <ArrowLeft size={18} />
                        Back to Dashboard
                    </button>

                    <span className="eyebrow">
                        STUDENT
                    </span>

                    <h1>
                        My QR Code
                    </h1>

                    <p>
                        Show this QR code to your faculty to mark attendance.
                    </p>

                </div>

                <button
                    className="secondary-button"
                    onClick={loadQr}
                >
                    <RefreshCw size={17} />
                    Refresh
                </button>

            </div>


            {/* ================= ERROR ================= */}

            {error && (
                <div className="alert error">
                    {error}
                </div>
            )}


            {/* ================= QR CARD ================= */}

            {!error && qrUrl && (

                <div className="student-qr-container">

                    <div className="student-qr-card">

                        <div className="qr-icon">
                            <QrCode size={24} />
                        </div>

                        <h2>
                            Your Attendance QR
                        </h2>

                        <p>
                            Present this QR code to your faculty during
                            an active attendance session.
                        </p>


                        <div className="qr-image-container">

                            <img
                                src={qrUrl}
                                alt="Student Attendance QR Code"
                                className="student-qr-image"
                            />

                        </div>


                        <button
                            className="primary-button qr-download-button"
                            onClick={downloadQr}
                        >
                            <Download size={18} />
                            Download QR Code
                        </button>

                    </div>

                </div>

            )}

        </div>
    );
}