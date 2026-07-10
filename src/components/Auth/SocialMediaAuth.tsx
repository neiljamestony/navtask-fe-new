import { useState } from 'react'
import {Divider, Button} from '@mui/material'
import FacebookIcon from '../../assets/Icons/Facebook.svg';
import GoogleIcon from '../../assets/Icons/Google.svg';

export default function SocialMediaAuth() {
    const [googleLoading, setGoogleLoading] = useState(false)
    const [facebookLoading, setFacebookLoading] = useState(false)
    const handleGoogleLogin = async () => {
        setGoogleLoading(true)
        window.location.href = "http://localhost:3000/auth/google";
    }

    const handleFacebookLogin = async () => {
        setFacebookLoading(true)
        window.location.href = "http://localhost:3000/auth/facebook";
    }
    return (
        <>
            <Divider>OR</Divider>
            <Button type="button" color="inherit" variant="outlined" disabled startIcon={<img src={GoogleIcon} height={15} width={15} alt="google-icon"/>} onClick={handleGoogleLogin}>{googleLoading ? "Loading ..." : "Continue with Google"}</Button>
            <Button type="button" color="inherit" variant="outlined" disabled startIcon={<img src={FacebookIcon} height={15} width={15} alt="fecebook-icon"/>} onClick={handleFacebookLogin}>{facebookLoading ? "Loading ..." : "Continue with Facebook"}</Button>
        </>    
    )
}