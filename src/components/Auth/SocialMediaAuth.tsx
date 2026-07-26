import { useState, useEffect } from 'react'
import {Divider, Button} from '@mui/material'
import FacebookIcon from '../../assets/Icons/Facebook.svg';
import GoogleIcon from '../../assets/Icons/Google.svg';
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux';
import { setAuthData } from '../../reducer/AuthSlice';
import { isAuthenticated } from '../../api/auth/auth';

export default function SocialMediaAuth() {
    const [googleLoading, setGoogleLoading] = useState(false)
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const [facebookLoading, setFacebookLoading] = useState(false)
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();
    const status = searchParams.get("status");
    const handleGoogleLogin = async () => {
        setGoogleLoading(true)
        window.location.href = `http://localhost:3000/auth/google?state=${pathname}`;
    }

    const handleFacebookLogin = async () => {
        setFacebookLoading(true)
        window.location.href = `http://localhost:3000/auth/facebook?state=${pathname}`;
    }

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
            <Button type="button" color="inherit" variant="outlined" startIcon={<img src={GoogleIcon} height={15} width={15} alt="google-icon"/>} onClick={handleGoogleLogin}>{googleLoading ? "Loading ..." : "Continue with Google"}</Button>
            <Button type="button" color="inherit" variant="outlined" startIcon={<img src={FacebookIcon} height={15} width={15} alt="fecebook-icon"/>} onClick={handleFacebookLogin}>{facebookLoading ? "Loading ..." : "Continue with Facebook"}</Button>
        </>    
    )
}