import { useState, useEffect } from 'react'
import { Divider, Button } from '@mui/material'
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setAuthData } from '../../reducer/AuthSlice';
import { isAuthenticated } from '../../api/auth/auth';
import toast from 'react-hot-toast'

// ICONS
import FacebookIcon from '../../assets/Icons/Facebook.svg';
import GoogleIcon from '../../assets/Icons/Google.svg';

const env = import.meta.env.VITE_NODE_ENV;
const apiUrl = env === "local" ? import.meta.env.VITE_API_URL : import.meta.env.VITE_PROD_API_URL;

export default function SocialMediaAuth() {
    const [googleLoading, setGoogleLoading] = useState(false)
    const { pathname } = useLocation();
    const [facebookLoading, setFacebookLoading] = useState(false)
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const status = searchParams.get("status");

    const handleGoogleLogin = async () => {
        setGoogleLoading(true)
        window.location.href = `${apiUrl}/auth/google?state=${pathname}`;
    }

    const handleFacebookLogin = async () => {
        setFacebookLoading(true)
        window.location.href = `${apiUrl}/auth/facebook?state=${pathname}`;
    }

    const buttons = [
        {
            name: "facebook",
            icon: FacebookIcon,
            action: handleFacebookLogin,
            loader: facebookLoading
        },
        {
            name: "google",
            icon: GoogleIcon,
            action: handleGoogleLogin,
            loader: googleLoading
        },
    ]

    const check = async () => {
        if(status === "DATA_EXISTS"){
            toast.error("Email already exists, kindly login your account.", {
                id: 'email-exists-error'
            })
        }else if(status === "ACCOUNT_NOT_FOUND"){
            toast.error("Account not found, kindly register your account first.", {
                id: 'email-not-found-error'
            })
        }else if(status === "SUCCESS"){
            const request = await isAuthenticated();

            if(!request.status){
                toast.error('Unauthorized, redirecting to login page',{
                    id: 'unauthorized-expired-error' 
                })
            }else{
                if(request.status === 200){
                    dispatch(setAuthData(request.data))
                    navigate("/")
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
                }
            }
        }
    }

    useEffect(() => {
        let done = true;
        done && check();
        return () => {
            done = false;
        }
    }, [])

    return (
        <>
            <Divider>OR</Divider>
            {
                buttons.map((button, key) => {
                    return <Button key={key} type="button" color="inherit" variant="outlined" startIcon={<img src={button.icon} height={15} width={15} alt={`${button.name}-icon`}/>} sx={{ textTransform: 'none', fontSize: 15 }} onClick={button.action}>{button.loader ? "Loading ..." : `Continue with ${button.name}`}</Button>
                })
            }
        </>    
    )
}