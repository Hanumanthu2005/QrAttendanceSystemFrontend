import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import {
    CheckCircle,
    Camera,
    XCircle
} from "lucide-react";

import { markAttendance } from "../../services/attendanceService";

export default function FacultyScanner() {

    const scannerRef = useRef(null);
    const processingRef = useRef(false);

    const [scanning, setScanning] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {

        const scanner = new Html5Qrcode("qr-reader");

        scannerRef.current = scanner;

        return () => {

            if (scanner.isScanning) {
                scanner
                    .stop()
                    .catch(() => {});
            }

        };

    }, []);

    const startScanner = async () => {

        try {

            setError("");
            setResult(null);

            const scanner = scannerRef.current;

            if (!scanner) {
                return;
            }

            await scanner.start(
                {
                    facingMode: "environment"
                },
                {
                    fps: 10,
                    qrbox: {
                        width: 250,
                        height: 250
                    }
                },
                async (decodedText) => {

                    if (processingRef.current) {
                        return;
                    }

                    processingRef.current = true;

                    try {

                        const attendance =
                            await markAttendance(decodedText);

                        setResult({
                            success: true,
                            data: attendance
                        });

                    } catch (error) {

                        setResult({
                            success: false,
                            message:
                                error.response?.data?.message ||
                                "Failed to mark attendance"
                        });

                    } finally {

                        setTimeout(() => {
                            processingRef.current = false;
                        }, 2000);

                    }

                },
                () => {
                    // QR not detected yet.
                    // We intentionally don't show an error
                    // for every unsuccessful camera frame.
                }
            );

            setScanning(true);

        } catch (error) {

            console.error(error);

            setError(
                "Unable to access the camera. Please allow camera permission."
            );

        }

    };

    const stopScanner = async () => {

        const scanner = scannerRef.current;

        if (!scanner) {
            return;
        }

        try {

            if (scanner.isScanning) {
                await scanner.stop();
            }

            setScanning(false);

        } catch (error) {

            console.error(error);

        }

    };

    return (
        <div>

            <div className="page-header">

                <div>
                    <h1>Scan Student QR</h1>

                    <p>
                        Scan a student's QR code to mark attendance.
                    </p>
                </div>

            </div>


            {error && (
                <div className="alert error">
                    {error}
                </div>
            )}


            <div className="scanner-layout">

                <div className="scanner-card">

                    <div className="scanner-header">

                        <Camera size={22} />

                        <div>
                            <h2>QR Scanner</h2>

                            <p>
                                Position the student's QR code
                                inside the frame.
                            </p>
                        </div>

                    </div>


                    <div
                        id="qr-reader"
                        className="qr-reader"
                    />


                    <div className="scanner-actions">

                        {!scanning ? (

                            <button
                                className="primary-button"
                                onClick={startScanner}
                            >
                                <Camera size={18} />
                                Start Camera
                            </button>

                        ) : (

                            <button
                                className="danger-button"
                                onClick={stopScanner}
                            >
                                <XCircle size={18} />
                                Stop Camera
                            </button>

                        )}

                    </div>

                </div>


                <div className="scan-result-card">

                    <h2>Latest Scan</h2>

                    {!result && (

                        <div className="scan-empty">

                            <Camera size={40} />

                            <p>
                                No student scanned yet.
                            </p>

                        </div>

                    )}


                    {result?.success && (

                        <div className="scan-success">

                            <CheckCircle size={42} />

                            <h3>
                                Attendance Marked
                            </h3>

                            <p>
                                {result.data.studentName}
                            </p>

                            <strong>
                                {result.data.studentRoll}
                            </strong>

                            <span>
                                PRESENT
                            </span>

                        </div>

                    )}


                    {result && !result.success && (

                        <div className="scan-error">

                            <XCircle size={42} />

                            <h3>
                                Attendance Failed
                            </h3>

                            <p>
                                {result.message}
                            </p>

                        </div>

                    )}

                </div>

            </div>

        </div>
    );
}