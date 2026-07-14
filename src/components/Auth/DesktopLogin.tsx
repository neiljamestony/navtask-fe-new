import { useState } from 'react'
import { Box, Card, CardHeader, CardContent, TextField, Button, Stack, CircularProgress, Typography, Grid, InputAdornment, IconButton } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../../api/auth/auth'
import type { IAuth } from '../../typescript/interface'
import toast from 'react-hot-toast';
import SocialMediaAuth from './SocialMediaAuth'
import { useSelector } from 'react-redux'
import type { RootState } from '../../store/store'
import { setAuthStatus, setAuthData } from '../../reducer/AuthSlice'
import { useDispatch } from 'react-redux'

// ICONS
import WallPaper from '../../assets/Wallpaper.svg';
import BrandAndLogo from '../../assets/Brand and logo.svg';
import ShowIcon from '../../assets/Icons/Show.svg';
import HideIcon from '../../assets/Icons/Hide.svg';

export default function DesktopLogin() {
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    })
    const [errors, setErrors] = useState<{key: string, error: string}[] | []>([]);
    const [showPassword, setShowPassword] = useState(false)
    const dispatch = useDispatch();
    const { authStatus } = useSelector((state: RootState) => state.auth)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (formData: IAuth) => {
        setLoading(true);
        const result = await login(formData);
        if(result?.status === 200){
            dispatch(setAuthData({...result?.data}))
            navigate("/");
            setLoading(false);
            dispatch(setAuthStatus(""))
        }else if(result?.status === 422){
            if(result?.errors){
                setErrors(result?.errors);
            }else{
                toast.error(result?.msg);
            }
            setLoading(false);
        }else if(result?.status === 500){
            toast.error("Something went wrong, please try again later.");
            setLoading(false);
        }
    }

    return (
        <Grid container>
            <Grid size={6}>
                <Box sx={{ backgroundImage: `url(${WallPaper})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', height: "100vh", width: '100%' }}>
                    <Box sx={{ display: "flex", justifyContent: 'center', alignItems: 'center', height: "100vh"}}>
                        <img src={BrandAndLogo} alt="brand-and-logo" height={100} width="100%"/>
                    </Box>
                </Box>
            </Grid>
            <Grid size={6}>
                <Box sx={{ display: "flex", justifyContent: 'center', alignItems: 'center', textAlign: 'center', height: "100vh"}}>
                    <Card variant="outlined" sx={{ height: authStatus === "Success!" ? 550 : 500, width: 400}}>
                        <form onSubmit={(e) => {
                                e.preventDefault();
                                handleSubmit(formData)
                            }}>
                            <CardHeader title={<Box sx={{ fontFamily: "Roboto", fontSize: 34, fontWeight: 'bold' }}>{authStatus === "Success!" ? "Account successfully created. Sign in to continue" : "Sign in"}</Box>}/>
                            <CardContent>
                                <Stack spacing={2}>
                                    <TextField name="username" error={errors.length > 0 && errors.filter((error) => error.key === "username").length > 0 } helperText={errors.length > 0 && errors.filter((error) => error.key === "username").length > 0 ? errors.filter((error) => error.key === "username")[0].error : ""} value={formData.username} type="text" size="small" label="Username" onChange={handleChange}/>
                                    <TextField 
                                        name="password" 
                                        error={errors.length > 0 && errors.filter((error) => error.key === "password").length > 0 } 
                                        helperText={errors.length > 0 && errors.filter((error) => error.key === "password").length > 0 ? errors.filter((error) => error.key === "password")[0].error : ""} 
                                        value={formData.password} 
                                        type={showPassword ? "text" : "password"} 
                                        size="small" 
                                        label="Password" 
                                        onChange={handleChange}
                                        slotProps={{
                                        input: {
                                            endAdornment: <InputAdornment position="end">
                                                <IconButton
                                                    aria-label={
                                                    showPassword ? 'hide the password' : 'display the password'
                                                    }
                                                    onClick={() => setShowPassword((prev) => !prev)}
                                                    edge="end"
                                                >
                                                    {showPassword ? <img src={HideIcon} alt="hide-password" height={20} width="100%"/> : <img src={ShowIcon} alt="show-password" height={15} width="100%"/> }
                                                </IconButton>
                                            </InputAdornment>,
                                        },
                                    }}
                                    />
                                    <Button variant="contained" type="submit" color="primary" disabled={loading}>{loading ? <CircularProgress size={30} color="inherit"/> : "Submit"}</Button>
                                    <Typography variant="caption" sx={{ fontFamily: 'Roboto', fontSize: 20, fontWeight: 'medium' }}>Don't have an account? <Link to='/register'><span style={{ fontFamily: "Roboto", fontWeight: "bold", color: "#1976d2"}}>Sign up</span></Link></Typography>
                                    <SocialMediaAuth/>
                                </Stack>
                            </CardContent>        
                        </form>
                    </Card>
                </Box>
            </Grid>
        </Grid>
    )
}
