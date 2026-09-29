import { Outlet, useNavigate, Navigate } from "react-router-dom";
import { Box, Typography, CircularProgress } from "@mui/material";
import { isAuthenticated } from "./api/auth/auth";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setAuthData } from "./reducer/AuthSlice";
import toast from "react-hot-toast";

const ProtectedRoute = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [authenticated, setAuthenticated] = useState<boolean | null>(null);
    
    useEffect(() => {
        let done = true
        const check = async () => {
            const requestWithTimeout = async () => {
                let timeoutId: ReturnType<typeof setTimeout>;

                try {
                return await Promise.race([
                    isAuthenticated(),
                    new Promise<never>((_, reject) => {
                    timeoutId = setTimeout(
                        () => reject(new Error("AUTH_REQUEST_TIMEOUT")),
                        5000
                    );
                    }),
                ]);
                } finally {
                clearTimeout(timeoutId!);
                }
            };

            try {
                let request;

                // Retry once if the request fails or times out.
                for (let attempt = 0; attempt < 2; attempt++) {
                try {
                    request = await requestWithTimeout();
                    break;
                } catch (error) {
                    if (attempt === 1) throw error;
                }
                }

                if (request?.status === 200) {
                dispatch(setAuthData(request.data));
                setAuthenticated(true);
                return;
                }

                if (request?.status === 401) {
                toast.error(
                    request.msg === "TOKEN_EXPIRED"
                    ? "Session expired, redirecting to login page."
                    : "Unauthorized, redirecting to login page.",
                    {
                    id:
                        request.msg === "TOKEN_EXPIRED"
                        ? "session-expired-error"
                        : "unauthorized-expired-error",
                    }
                );
                } else {
                toast.error("Unable to verify your session. Redirecting to login page.", {
                    id: "auth-check-error",
                });
                }

                setAuthenticated(false);
                navigate("/login", { replace: true });
            } catch (error) {
                const timedOut =
                error instanceof Error && error.message === "AUTH_REQUEST_TIMEOUT";

                toast.error(
                timedOut
                    ? "The server did not respond within 5 seconds. Redirecting to login page."
                    : "Unable to connect to the server. Redirecting to login page.",
                { id: "auth-connection-error" }
                );

                setAuthenticated(false);
                navigate("/login", { replace: true });
            }
            };

        done && check();

        return () => {
            done = false;
        }
    }, []);

    if (authenticated === null) {
        return (
            <Box
                role="status"
                aria-live="polite"
                sx={{
                    minHeight: "100dvh",
                    boxSizing: "border-box",
                    display: "grid",
                    placeItems: "center",
                    bgcolor: "#f6f8fb",
                    px: 2,
                }}
            >
                <Box
                    sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 1.5,
                    p: 4,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 3,
                    bgcolor: "background.paper",
                    boxShadow: "0 12px 32px rgba(15, 23, 42, 0.06)",
                    }}
                >
                    <CircularProgress size={32} />

                    <Box sx={{ textAlign: "center" }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        Checking your session
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Redirecting you shortly…
                    </Typography>
                    </Box>
                </Box>
            </Box>
        );
    }
    return authenticated ? <Outlet/> : <Navigate to="/login"/>
};

export default ProtectedRoute;