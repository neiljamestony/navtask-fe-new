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

    if(authenticated === null){
        return <Box sx={{ display: "flex", justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2  }}>
                <CircularProgress color="inherit" size={40}/>
                <Typography sx={{ fontSize: 30 }}>Redirecting ...</Typography>
            </Box>
        </Box>
    }
    return authenticated ? <Outlet/> : <Navigate to="/login"/>
};

export default ProtectedRoute;