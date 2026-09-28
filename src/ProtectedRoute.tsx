import { Outlet, Navigate } from "react-router-dom";
import { Box, Typography, CircularProgress } from "@mui/material";
import { isAuthenticated } from "./api/auth/auth";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setAuthData } from "./reducer/AuthSlice";
import toast from "react-hot-toast";

const ProtectedRoute = () => {
    const dispatch = useDispatch();
    const [authenticated, setAuthenticated] = useState<boolean | null>(null);
    
    useEffect(() => {
        let done = true
        const check = async () => {
            try {
                const request = await isAuthenticated();
                if(!request.status){
                    toast.error('Unauthorized, redirecting to login page',{
                        id: 'unauthorized-expired-error' 
                    })
                    setAuthenticated(false);
                }else{
                    if(request.status === 200){
                        const isAuth = request.status === 200;
                        dispatch(setAuthData(request.data))
                        setAuthenticated(isAuth);
                    }
                    if(request?.status === 401){
                        if(request?.msg === "TOKEN_EXPIRED"){
                            toast.error('Session expired, redirecting to login page',{
                                id: 'session-expired-error' 
                            })               

                        }else if (request?.msg === "UNAUTHORIZED"){
                            toast.error('Unauthorized, redirecting to login page',{
                                id: 'unauthorized-expired-error' 
                            })
                        }
                        setAuthenticated(false);
                    }
                }
                
            } catch (err: any) {
                const message = err instanceof Error ? err.message : err;
                toast.error(message)
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